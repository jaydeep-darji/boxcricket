<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

// Process team registration with payment data
if ($input['paymentStatus'] === 'completed') {
    // Save to database
    // Send confirmation email
    echo json_encode(['success' => true, 'message' => 'Team registered successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Payment not completed']);
}
?>