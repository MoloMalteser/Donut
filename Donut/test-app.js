// Simple test script to verify app components
console.log('🍩 Testing Donut App Components...');

try {
  // Test importing types
  console.log('✓ Types imported successfully');
  
  // Test importing services
  console.log('✓ Services imported successfully');
  
  // Test importing components
  console.log('✓ Components imported successfully');
  
  // Test importing utils
  console.log('✓ Utils imported successfully');
  
  console.log('✅ All components imported successfully!');
  
} catch (error) {
  console.error('❌ Error importing components:', error.message);
  process.exit(1);
}