// netlify/functions/send-plan-change.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { clientName, currentPlan, requestedPlan, clientEmail } = JSON.parse(event.body);
    
    const apiToken = '7a28b758f3ac20087b3f07b1fc4419166de1fd0b';
    const companyDomain = 'kinectb2b';
    
    const baseUrl = `https://${companyDomain}.pipedrive.com/api/v1`;
    
    // Create a note in Pipedrive about the plan change request
    const noteData = {
      content: `Plan Change Request:
        Client: ${clientName}
        Current Plan: ${currentPlan}
        Requested Plan: ${requestedPlan}
        Client Email: ${clientEmail}
        
        Action Required: Contact client within 24 hours to process plan change.`,
      deal_id: null, // You'd need to find the client's deal ID
      person_id: null, // You'd need to find the client's person ID
    };

    const noteResponse = await fetch(
      `${baseUrl}/notes?api_token=${apiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData)
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Plan change request submitted successfully' 
      })
    };

  } catch (error) {
    console.error('Error processing plan change:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process plan change request',
        details: error.message 
      })
    };
  }
};