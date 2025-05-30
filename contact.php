<?php
// contact.php avec PHPMailer et Mailtrap (test mailbox)
$phpmailer_ok = true;
$phpmailer_path = __DIR__ . '/PHPMailer/';
$required_files = ['PHPMailer.php', 'SMTP.php', 'Exception.php'];
foreach ($required_files as $file) {
    if (!file_exists($phpmailer_path . $file)) {
        $phpmailer_ok = false;
        break;
    }
}
if (!$phpmailer_ok) {
    http_response_code(500);
    echo "Erreur : Les fichiers PHPMailer sont manquants.\n";
    echo "Placez le dossier PHPMailer/ à la racine du projet avec PHPMailer.php, SMTP.php, Exception.php.";
    exit;
}
require_once $phpmailer_path . 'PHPMailer.php';
require_once $phpmailer_path . 'SMTP.php';
require_once $phpmailer_path . 'Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: text/plain; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $interest = htmlspecialchars(trim($_POST['interest'] ?? ''));
    $details = htmlspecialchars(trim($_POST['details'] ?? ''));

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'feriolentsame@gmail.com'; // Votre adresse Gmail
        $mail->Password = 'VOTRE_MOT_DE_PASSE_APPLI'; // Mot de passe d'application Gmail (voir https://myaccount.google.com/apppasswords)
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom('feriolentsame@gmail.com', 'Portfolio Arty Feriole');
        $mail->addAddress('feriolentsame@gmail.com'); // Réception sur votre Gmail
        $mail->addReplyTo($email, $name);

        $mail->Subject = 'Nouveau visiteur - Formulaire de contact (Exprimez votre besoin)';
        $mail->Body = "Un visiteur s'est enregistré sur votre portfolio :\n\n"
            . "Nom : $name\n"
            . "Email : $email\n"
            . "Intérêt : $interest\n"
            . "Détails : $details\n";

        $mail->send();
        echo 'success';
    } catch (Exception $e) {
        http_response_code(500);
        echo 'Erreur lors de l\'envoi : ' . $mail->ErrorInfo;
    }
} else {
    http_response_code(405);
    echo 'Méthode non autorisée';
}
?>
