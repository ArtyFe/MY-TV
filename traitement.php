<?php
// traitement.php : envoi simple d'email depuis le formulaire de contact
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/PHPMAILER/Exception.php';
require_once __DIR__ . '/PHPMAILER/PHPMailer.php';
require_once __DIR__ . '/PHPMAILER/SMTP.php';

$mail = new PHPMailer(true);

try {
    // Configuration SMTP Gmail (SSL, port 465)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'feriolentsame@gmail.com'; // Votre adresse Gmail
    $mail->Password   = 'VOTRE_MOT_DE_PASSE_APPLI'; // Mot de passe d'application Gmail
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    // Contenu du message
    $mail->setFrom('feriolentsame@gmail.com', 'Arty Feriole');
    $mail->addAddress('feriolentsame@gmail.com'); // Réception sur votre Gmail
    $mail->Subject = 'Message du formulaire';
    $mail->Body    = "Nom: " . $_POST['nom'] . "\nEmail: " . $_POST['email'] . "\nMessage: " . $_POST['message'];

    $mail->send();
    echo 'Message envoyé avec succès !';
} catch (Exception $e) {
    echo "Erreur d'envoi : {$mail->ErrorInfo} | Exception: {$e->getMessage()}";
}
?>
