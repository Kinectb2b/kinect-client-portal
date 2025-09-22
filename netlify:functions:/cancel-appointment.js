// netlify/functions/cancel-appointment.js
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
    const { appointmentIndex, clientName } = JSON.parse(event.body);
    
    const apiToken = '7a28b758f3ac20087b3f07b1fc4419166de1fd0b';
    const companyDomain = 'kinectb2b';
    
    const baseUrl = `https://${companyDomain}.pipedrive.com/api/v1`;
    
    // Create a note about the cancellation
    const cancellationNote = {
      content: `Appointment Cancelled by ${clientName}:
        
        Reason: Client requested cancellation
        Cancelled: ${new Date().toLocaleString()}
        
        Please follow up to reschedule if appropriate.`,
    };

    const noteResponse = await fetch(
      `${baseUrl}/notes?api_token=${apiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancellationNote)
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Appointment cancelled successfully' 
      })
    };

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to cancel appointment',
        details: error.message 
      })
    };
  }
};