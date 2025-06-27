<?php
session_start();
session_unset();
session_destroy();
header("Location: ../index.php"); // Or whatever your main page is
exit();
