import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

console.log('🔍 環境変数確認:');
console.log('  GMAIL_USER:', process.env.GMAIL_USER);
console.log('  GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✓ 設定済み' : '❌ 未設定');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// メール送信の設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// メール送信エンドポイント
app.post('/api/send-email', async (req, res) => {
  const { user_name, user_email, message } = req.body;

  console.log('📧 メール送信リクエスト:', { user_name, user_email });

  // バリデーション
  if (!user_name || !user_email || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'すべての項目を入力してください'
    });
  }

  try {
    // クライアントへのメール
    const clientMailOptions = {
      from: process.env.GMAIL_USER,
      to: user_email,
      subject: 'お問い合わせありがとうございます',
      html: `
        <h2>お問い合わせ確認</h2>
        <p>${user_name} 様</p>
        <p>この度はお問い合わせいただき、ありがとうございます。</p>
        <p>以下の内容でお問い合わせを受け付けました。</p>
        <hr>
        <p><strong>お名前:</strong> ${user_name}</p>
        <p><strong>メールアドレス:</strong> ${user_email}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>確認後、ご返信させていただきます。</p>
      `
    };

    // オーナーへのメール
    const ownerMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `新しいお問い合わせ: ${user_name}`,
      html: `
        <h2>新しいお問い合わせがあります</h2>
        <p><strong>お名前:</strong> ${user_name}</p>
        <p><strong>メールアドレス:</strong> ${user_email}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // 両方のメール送信を並行実行
    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(ownerMailOptions)
    ]);

    console.log('✓ メール送信完了');
    
    res.status(200).json({
      status: 'success',
      message: '送信が完了しました。ご連絡ありがとうございます。'
    });

  } catch (error) {
    console.error('❌ メール送信エラー:', error);
    
    res.status(500).json({
      status: 'error',
      message: 'メール送信に失敗しました。しばらくしてからお試しください。',
      error: error.message
    });
  }
});

// ページの静的配信
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ サーバー起動: http://localhost:${PORT}`);
});
