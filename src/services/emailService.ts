import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export class EmailService {
  // envoie de password reset email lel user
  static async sendPasswordResetEmail(email: string, resetToken: string) {
    console.log('sendPasswordResetEmail called for:', email);
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Groupe Sghaier',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a237e;">Groupe Sghaier</h2>
          <h3>Réinitialisation de votre mot de passe</h3>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" style="background-color: #1a237e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </p>
          <p>Ce lien expire dans <strong>1 heure</strong>.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">© 2026 Groupe Sghaier. Tous droits réservés.</p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, message: 'Email envoyé avec succès.' };
    } catch (error) {
      console.error('Email error:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email.');
    }
  }
}