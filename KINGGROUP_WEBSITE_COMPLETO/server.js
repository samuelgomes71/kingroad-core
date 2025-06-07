const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('rate-limiter-flexible');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: "key-id",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  client_email: `firebase-adminsdk@${process.env.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
  client_id: "client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
};

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(cors({
  origin: [
    'https://upbeat-circlet-460522-r0-98a40.web.app',
    'https://upbeat-circlet-460522-r0-98a40.firebaseapp.com',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const rateLimiter = new rateLimit.RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Número de requests
  duration: 60, // Por minuto
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({ error: 'Too many requests' });
  }
});

// Configuração do Multer para upload de APKs
const storage_multer = multer.memoryStorage();
const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.android.package-archive' || 
        file.originalname.endsWith('.apk')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos APK são permitidos'), false);
    }
  }
});

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Rotas da API

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    project: process.env.FIREBASE_PROJECT_ID,
    version: '1.0.0'
  });
});

// Listar aplicativos
app.get('/api/apps', async (req, res) => {
  try {
    const appsSnapshot = await db.collection('apps').orderBy('name').get();
    const apps = [];
    
    appsSnapshot.forEach(doc => {
      apps.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(apps);
  } catch (error) {
    console.error('Erro ao listar apps:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Upload de APK
app.post('/api/apps/:appId/upload', authenticateToken, upload.single('apk'), async (req, res) => {
  try {
    const { appId } = req.params;
    const { version, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Arquivo APK é obrigatório' });
    }

    // Upload para Firebase Storage
    const bucket = storage.bucket();
    const fileName = `apks/${appId}/${version}/${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          appId,
          version,
          uploadedBy: req.user.uid,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    stream.on('error', (error) => {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro no upload do arquivo' });
    });

    stream.on('finish', async () => {
      try {
        // Tornar arquivo público
        await fileUpload.makePublic();
        
        // Obter URL de download
        const downloadURL = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;

        // Salvar informações no Firestore
        const appDoc = await db.collection('apps').doc(appId).get();
        if (!appDoc.exists) {
          return res.status(404).json({ error: 'Aplicativo não encontrado' });
        }

        const versionData = {
          version,
          description: description || '',
          downloadURL,
          fileName: file.originalname,
          fileSize: file.size,
          uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
          uploadedBy: req.user.uid,
          downloads: 0
        };

        await db.collection('apps').doc(appId).collection('versions').doc(version).set(versionData);

        // Atualizar última versão no documento principal
        await db.collection('apps').doc(appId).update({
          latestVersion: version,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
          success: true,
          downloadURL,
          version,
          message: 'APK enviado com sucesso'
        });

      } catch (error) {
        console.error('Erro ao salvar no Firestore:', error);
        res.status(500).json({ error: 'Erro ao salvar informações do arquivo' });
      }
    });

    stream.end(file.buffer);

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Download de APK
app.get('/api/apps/:appId/download/:version', async (req, res) => {
  try {
    const { appId, version } = req.params;

    // Buscar informações da versão
    const versionDoc = await db.collection('apps').doc(appId).collection('versions').doc(version).get();
    
    if (!versionDoc.exists) {
      return res.status(404).json({ error: 'Versão não encontrada' });
    }

    const versionData = versionDoc.data();

    // Incrementar contador de downloads
    await versionDoc.ref.update({
      downloads: admin.firestore.FieldValue.increment(1),
      lastDownload: admin.firestore.FieldValue.serverTimestamp()
    });

    // Redirecionar para URL de download
    res.redirect(versionData.downloadURL);

  } catch (error) {
    console.error('Erro no download:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas
app.get('/api/stats', async (req, res) => {
  try {
    const appsSnapshot = await db.collection('apps').get();
    let totalApps = 0;
    let totalDownloads = 0;
    let totalVersions = 0;

    for (const appDoc of appsSnapshot.docs) {
      totalApps++;
      const versionsSnapshot = await appDoc.ref.collection('versions').get();
      totalVersions += versionsSnapshot.size;
      
      versionsSnapshot.forEach(versionDoc => {
        const versionData = versionDoc.data();
        totalDownloads += versionData.downloads || 0;
      });
    }

    res.json({
      totalApps,
      totalVersions,
      totalDownloads,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Rota catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor KingGroup rodando na porta ${PORT}`);
  console.log(`📱 Projeto: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`🌐 URL: https://upbeat-circlet-460522-r0-98a40.web.app/`);
});

module.exports = app;

