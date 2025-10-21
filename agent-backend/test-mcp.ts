import dotenv from 'dotenv';
import { MCPService } from './src/services/mcp.service';

// Load environment variables
dotenv.config();

async function testMCP() {
  const mcp = new MCPService();
  
  console.log('='.repeat(80));
  console.log('Testing MCP Connection to CMS');
  console.log('='.repeat(80));
  console.log(`MCP Endpoint: ${process.env.MCP_BASE_URL || 'https://hbr-flextest-dl2x0l.8hm1bl.usa-e2.cloudhub.io/cms'}\n`);
  
  const results: { [key: string]: boolean } = {};
  let testCustomerId: string | null = null;
  let testCardId: string | null = null;

  // Test 1: get_all_customers
  try {
    console.log('[1/10] Testing get_all_customers...');
    const customers = await mcp.getAllCustomers();
    console.log(`✓ Success: Retrieved ${Array.isArray(customers) ? customers.length : 0} customers`);
    if (Array.isArray(customers) && customers.length > 0) {
      console.log(`   Sample: ${customers[0].name} (${customers[0].customerId})`);
      testCustomerId = customers[0].customerId;
    }
    results['get_all_customers'] = true;
  } catch (error: any) {
    console.error(`✗ Failed: ${error.message}`);
    results['get_all_customers'] = false;
  }
  console.log('');

  // Test 2: get_customer_by_id
  if (testCustomerId) {
    try {
      console.log('[2/10] Testing get_customer_by_id...');
      const customer = await mcp.getCustomerById(testCustomerId);
      console.log(`✓ Success: Retrieved customer ${customer.name}`);
      console.log(`   Details: Email: ${customer.email}, Phone: ${customer.phone}`);
      results['get_customer_by_id'] = true;
    } catch (error: any) {
      console.error(`✗ Failed: ${error.message}`);
      results['get_customer_by_id'] = false;
    }
  } else {
    console.log('[2/10] Skipping get_customer_by_id (no customer ID available)');
    results['get_customer_by_id'] = false;
  }
  console.log('');

  // Test 3: create_customer
  try {
    console.log('[3/10] Testing create_customer...');
    const timestamp = Date.now();
    const newCustomer = await mcp.createCustomer(
      'Test User ' + timestamp,
      `test${timestamp}@example.com`,
      '+1-555-' + Math.floor(Math.random() * 1000000)
    );
    console.log(`   Raw response:`, JSON.stringify(newCustomer, null, 2));
    console.log(`✓ Success: Created customer ${newCustomer.name || 'N/A'}`);
    console.log(`   Customer ID: ${newCustomer.customerId || 'N/A'}`);
    testCustomerId = newCustomer.customerId || (newCustomer as any).id; // Use this for later tests
    results['create_customer'] = true;
  } catch (error: any) {
    console.error(`✗ Failed: ${error.message}`);
    results['create_customer'] = false;
  }
  console.log('');

  // Test 4: update_customer
  if (testCustomerId) {
    try {
      console.log('[4/10] Testing update_customer...');
      const updatedCustomer = await mcp.updateCustomer(
        testCustomerId,
        'Updated Test User',
        `updated${Date.now()}@example.com`,
        '+1-555-9999999'
      );
      console.log(`✓ Success: Updated customer ${updatedCustomer.name}`);
      console.log(`   New email: ${updatedCustomer.email}`);
      results['update_customer'] = true;
    } catch (error: any) {
      console.error(`✗ Failed: ${error.message}`);
      results['update_customer'] = false;
    }
  } else {
    console.log('[4/10] Skipping update_customer (no customer ID available)');
    results['update_customer'] = false;
  }
  console.log('');

  // Test 5: get_all_cards
  try {
    console.log('[5/10] Testing get_all_cards...');
    const cards = await mcp.getAllCards();
    console.log(`✓ Success: Retrieved ${Array.isArray(cards) ? cards.length : 0} cards`);
    if (Array.isArray(cards) && cards.length > 0) {
      console.log(`   Sample: Card ending in ${cards[0].cardNumber.slice(-4)} (${cards[0].cardId})`);
      testCardId = cards[0].cardId;
    }
    results['get_all_cards'] = true;
  } catch (error: any) {
    console.error(`✗ Failed: ${error.message}`);
    results['get_all_cards'] = false;
  }
  console.log('');

  // Test 6: get_card_by_id
  if (testCardId) {
    try {
      console.log('[6/10] Testing get_card_by_id...');
      const card = await mcp.getCardById(testCardId);
      console.log(`✓ Success: Retrieved card ending in ${card.cardNumber.slice(-4)}`);
      console.log(`   Details: Type: ${card.cardType}, Expires: ${card.expiryDate}`);
      results['get_card_by_id'] = true;
    } catch (error: any) {
      console.error(`✗ Failed: ${error.message}`);
      results['get_card_by_id'] = false;
    }
  } else {
    console.log('[6/10] Skipping get_card_by_id (no card ID available)');
    results['get_card_by_id'] = false;
  }
  console.log('');

  // Test 7: create_card
  if (testCustomerId) {
    try {
      console.log('[7/10] Testing create_card...');
      const cardNumber = '4532' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      const newCard = await mcp.createCard(
        testCustomerId,
        cardNumber,
        'debit',
        '12/2026'
      );
      console.log(`✓ Success: Created card ending in ${newCard.cardNumber.slice(-4)}`);
      console.log(`   Card ID: ${newCard.cardId}`);
      testCardId = newCard.cardId; // Use this for later tests
      results['create_card'] = true;
    } catch (error: any) {
      console.error(`✗ Failed: ${error.message}`);
      results['create_card'] = false;
    }
  } else {
    console.log('[7/10] Skipping create_card (no customer ID available)');
    results['create_card'] = false;
  }
  console.log('');

  // Test 8: update_card
  if (testCardId) {
    try {
      console.log('[8/10] Testing update_card...');
      const cardNumber = '4532' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      const updatedCard = await mcp.updateCard(
        testCardId,
        cardNumber,
        'credit',
        '12/2027'
      );
      console.log(`✓ Success: Updated card ending in ${updatedCard.cardNumber.slice(-4)}`);
      console.log(`   New type: ${updatedCard.cardType}, New expiry: ${updatedCard.expiryDate}`);
      results['update_card'] = true;
    } catch (error: any) {
      console.error(`✗ Failed: ${error.message}`);
      results['update_card'] = false;
    }
  } else {
    console.log('[8/10] Skipping update_card (no card ID available)');
    results['update_card'] = false;
  }
  console.log('');

  // Test 9: delete_card
  if (testCardId) {
    try {
      console.log('[9/10] Testing delete_card...');
      const result = await mcp.deleteCard(testCardId);
      console.log(`✓ Success: ${result.message || 'Card deleted'}`);
      results['delete_card'] = true;
      testCardId = null; // Clear the ID since it's deleted
    } catch (error: any) {
      console.error(`✗ Failed: ${error.message}`);
      results['delete_card'] = false;
    }
  } else {
    console.log('[9/10] Skipping delete_card (no card ID available)');
    results['delete_card'] = false;
  }
  console.log('');

  // Test 10: delete_customer
  if (testCustomerId) {
    try {
      console.log('[10/10] Testing delete_customer...');
      const result = await mcp.deleteCustomer(testCustomerId);
      console.log(`✓ Success: ${result.message || 'Customer deleted'}`);
      results['delete_customer'] = true;
    } catch (error: any) {
      console.error(`✗ Failed: ${error.message}`);
      results['delete_customer'] = false;
    }
  } else {
    console.log('[10/10] Skipping delete_customer (no customer ID available)');
    results['delete_customer'] = false;
  }
  console.log('');

  // Summary
  console.log('='.repeat(80));
  console.log('Test Summary');
  console.log('='.repeat(80));
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(v => v === true).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log('');
  
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✓' : '✗'} ${test}`);
  });
  
  console.log('='.repeat(80));
  
  if (passedTests === totalTests) {
    console.log('✓ ALL MCP TOOLS WORKING! Ready to proceed with agent development.');
  } else {
    console.log('✗ SOME TESTS FAILED. Fix MCP connection before proceeding.');
    process.exit(1);
  }
}

// Run tests
testMCP().catch(error => {
  console.error('Fatal error during testing:', error);
  process.exit(1);
});

