import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AuthService } from '../services/authService';
import { EmailService } from '../services/emailService';

export class AuthController {
  // enregistrement d'un nouveau client (Individual or Company)
  // POST /api/auth/register
  static async register(req: AuthRequest, res: Response) {
    try {
      const { clientType, email, password, nom, prenom, nomSociete, telephone, adresse, codePostal, ville, matriculeFiscal, brancheContact, produitsInterets } = req.body;

      if (!email || !password || !clientType) {
        return res.status(400).json({
          success: false,
          message: 'Email, mot de passe et type de client sont obligatoires.'
        });
      }

      let result;

      if (clientType === 'INDIVIDUEL') {
        if (!nom || !prenom) {
          return res.status(400).json({ success: false, message: 'Nom et prénom sont obligatoires pour un client individuel.' });
        }
        result = await AuthService.registerIndividual({
          email, password, nom, prenom, telephone, adresse, codePostal, ville, brancheContact, produitsInterets
        });
      } else if (clientType === 'SOCIETE') {
        if (!nomSociete || !matriculeFiscal) {
          return res.status(400).json({ success: false, message: 'Nom de société et matricule fiscal sont obligatoires.' });
        }
        result = await AuthService.registerCompany({
          email, password, nomSociete, telephone, adresse, codePostal, ville, matriculeFiscal, brancheContact, produitsInterets
        });
      } else {
        return res.status(400).json({ success: false, message: 'Type de client invalide.' });
      }

      return res.status(201).json({
        success: true,
        message: 'Inscription réussie avec succès.',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Erreur lors de l'inscription.",
      });
    }
  }

  // Login pour Client ou Admin
  // POST /api/auth/login
  static async login(req: AuthRequest, res: Response) {
    try {
      const { email, password, clientType } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe sont obligatoires.'
        });
      }

      const result = await AuthService.loginUser({ email, password, clientType });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Identifiants incorrects.',
      });
    }
  }

  // Get authenticated client profile
  // GET /api/auth/profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non authentifié.' });
      }

      const profile = await AuthService.getClientProfile(userId);
      return res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Profil introuvable.',
      });
    }
  }

  // Update authenticated client profile
  // PUT /api/auth/profile
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non authentifié.' });
      }

      const updatedClient = await AuthService.updateClientProfile(userId, req.body);

      return res.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès.',
        data: updatedClient,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du profil.',
      });
    }
  }

  // Request password reset - sends email with reset link
  // POST /api/auth/forgot-password
  static async forgotPassword(req: AuthRequest, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'L\'email est obligatoire.',
        });
      }

      const resetToken = await AuthService.generateResetToken(email);

      // Send email with reset link
      await EmailService.sendPasswordResetEmail(email, resetToken);

      return res.status(200).json({
        success: true,
        message: 'Un email de réinitialisation a été envoyé.',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la demande de réinitialisation.',
      });
    }
  }

  // Reset password with token
  // POST /api/auth/reset-password
  static async resetPassword(req: AuthRequest, res: Response) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          success: false,
          message: 'Token et nouveau mot de passe sont obligatoires.',
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Le mot de passe doit contenir au moins 8 caractères.',
        });
      }

      const result = await AuthService.resetPassword(token, password);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de la réinitialisation du mot de passe.',
      });
    }
  }
}