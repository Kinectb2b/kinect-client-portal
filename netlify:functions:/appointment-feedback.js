// netlify/functions/appointment-feedback.js
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
    const { appointmentIndex, outcome, dealValue, notes, clientName } = JSON.parse(event.body);
    
    const apiToken = '7a28b758f3ac20087b3f07b1fc4419166de1fd0b';
    const companyDomain = 'kinectb2b';
    
    const baseUrl = `https://${companyDomain}.pipedrive.com/api/v1`;
    
    // Create detailed feedback note in Pipedrive
    const feedbackNote = {
      content: `Appointment Feedback from ${clientName}:
        
        Outcome: ${outcome}
        ${dealValue ? `Deal Value: $${dealValue.toLocaleString()}` : ''}
        
        Client Notes: ${notes || 'No additional notes provided'}
        
        Submitted: ${new Date().toLocaleString()}`,
      deal_id: null, // You'd find the relevant deal ID
      person_id: null, // You'd find the relevant person ID
    };

    // If it's a closed-won deal, you might want to update the deal status
    if (outcome === 'closed-won' && dealValue) {
      console.log(`Deal won for $${dealValue}`);
    }

    const noteResponse = await fetch(
      `${baseUrl}/notes?api_token=${apiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackNote)
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Feedback submitted successfully' 
      })
    };

  } catch (error) {
    console.error('Error processing appointment feedback:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process feedback',
        details: error.message 
      })
    };
  }
};