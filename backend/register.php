<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'];
    $mobile = $_POST['mobile'];
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if ($password !== $confirm_password) {
        echo "<script>
            alert('Passwords do not match!');
            window.location.href = '../SignUp_LogIn_Form.html';
        </script>";
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (username, mobile, password) VALUES ('$username', '$mobile', '$hashed_password')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>
            alert('Registration successful!');
            window.location.href = '../SignUp_LogIn_Form.html';
        </script>";
    } else {
        echo "<script>
            alert('Registration failed: " . $conn->error . "');
            window.location.href = '../SignUp_LogIn_Form.html';
        </script>";
    }

    exit();
}
?>
