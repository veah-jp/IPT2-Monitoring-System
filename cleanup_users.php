<?php
// Cleanup users table - keep only admin user
try {
    // Database connection details
    $host = 'localhost';
    $dbname = 'monitoring_database';
    $username = 'root';
    $password = '';
    
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to database successfully!\n\n";
    
    // Check current users
    echo "Current users in database:\n";
    echo "==========================\n";
    $stmt = $pdo->query("SELECT user_id, username, role, linked_id, created_at FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($users)) {
        echo "No users found in database.\n";
    } else {
        foreach ($users as $user) {
            echo "- ID: {$user['user_id']}, Username: {$user['username']}, Role: {$user['role']}, Linked ID: {$user['linked_id']}, Created: {$user['created_at']}\n";
        }
    }
    
    echo "\nTotal users: " . count($users) . "\n\n";
    
    // Check if admin user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    $stmt->execute();
    $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$adminUser) {
        echo "❌ No admin user found! Creating admin user...\n";
        
        // Create admin user
        $adminUsername = 'admin';
        $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role, linked_id, created_at, updated_at) VALUES (?, ?, 'admin', NULL, NOW(), NOW())");
        $stmt->execute([$adminUsername, $adminPassword]);
        
        echo "✅ Admin user created: username='admin', password='admin123'\n\n";
    } else {
        echo "✅ Admin user exists: {$adminUser['username']}\n\n";
    }
    
    // Clean up unnecessary users (keep only admin)
    echo "Cleaning up unnecessary users...\n";
    
    // Delete all non-admin users
    $stmt = $pdo->prepare("DELETE FROM users WHERE role != 'admin'");
    $deletedCount = $stmt->rowCount();
    $stmt->execute();
    
    echo "Deleted {$deletedCount} non-admin users.\n";
    
    // Show final users
    echo "\nFinal users after cleanup:\n";
    echo "==========================\n";
    $stmt = $pdo->query("SELECT user_id, username, role, linked_id, created_at FROM users");
    $finalUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($finalUsers as $user) {
        echo "- ID: {$user['user_id']}, Username: {$user['username']}, Role: {$user['role']}, Linked ID: {$user['linked_id']}, Created: {$user['created_at']}\n";
    }
    
    echo "\nTotal users after cleanup: " . count($finalUsers) . "\n";
    
    // Check if faculty table has any records that might reference deleted users
    echo "\nChecking faculty table for orphaned records...\n";
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM faculty");
    $facultyCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($facultyCount > 0) {
        echo "⚠️  Faculty table has {$facultyCount} records. These may reference deleted users.\n";
        echo "Consider clearing faculty table if you want to start fresh.\n";
    } else {
        echo "✅ Faculty table is empty.\n";
    }
    
    echo "\n✅ Users table cleanup completed!\n";
    echo "You can now log in with:\n";
    echo "Username: admin\n";
    echo "Password: admin123\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
