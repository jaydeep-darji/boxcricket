<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'];
    $mobile = $_POST['mobile'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username='$username' AND mobile='$mobile'";
    $result = $conn->query($sql);

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if (password_verify($password, $row['password'])) {
            session_start(); 
            $_SESSION['username'] = $row['username']; // Set session variable
            echo "<script>
                alert('Login successful!');
                window.location.href = '../index.php'; // Redirect to index
            </script>";
        } else {
            echo "<script>alert('Invalid password'); history.back();</script>";
        }
    } else {
        echo "<script>alert('User not found'); history.back();</script>";
    }

    exit();
}
?>
