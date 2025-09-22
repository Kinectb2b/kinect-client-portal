// netlify/functions/reschedule-appointment.js
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
    const { appointmentIndex, newDate, newTime, clientName } = JSON.parse(event.body);
    
    const apiToken = '7a28b758f3ac20087b3f07b1fc4419166de1fd0b';
    const companyDomain = 'kinectb2b';
    
    const baseUrl = `https://${companyDomain}.pipedrive.com/api/v1`;
    
    // Create a new activity in Pipedrive for the rescheduled appointment
    const activityData = {
      subject: `Rescheduled Appointment - ${clientName}`,
      due_date: newDate,
      due_time: newTime,
      type: 'meeting',
      note: `Appointment rescheduled by client to ${newDate} at ${newTime}`,
      done: 0
    };

    const activityResponse = await fetch(
      `${baseUrl}/activities?api_token=${apiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      }
    );

    // Create a note about the reschedule
    const rescheduleNote = {
      content: `Appointment Rescheduled by ${clientName}:
        
        New Date: ${newDate}
        New Time: ${newTime}
        
        Original appointment has been updated.
        Please confirm with all parties.
        
        Rescheduled: ${new Date().toLocaleString()}`,
    };

    const noteResponse = await fetch(
      `${baseUrl}/notes?api_token=${apiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rescheduleNote)
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Appointment rescheduled successfully' 
      })
    };

  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to reschedule appointment',
        details: error.message 
      })
    };
  }
};