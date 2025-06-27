<?php
$servername = "sql5.freesqldatabase.com";
$username = "sql5787083";
$password = "LX32BYS8jB";
$database = "sql5787083";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
