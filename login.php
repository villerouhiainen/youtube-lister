<?php
$username = $_POST['username'];
$password = $_POST['password'];
$loginData = [];

// login test
if($username === "admin" && $password === "password") {
    $loginData['loggedIn'] = true; 
    $loginData['username'] = "admin"; 
}
else {
    $loginData['loggedIn'] = false;
}
echo json_encode($loginData);
?>
