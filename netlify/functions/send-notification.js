// netlify/functions/send-notification.js
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { clientName, clientEmail, appointment } = JSON.parse(event.body);
    
    const RESEND_API_KEY = 're_c5s2qMJm_NesgFKX1Y8A5mzhZTvo7wuey';
    
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Kinect B2B <notifications@kinectb2b-portal.com>',
        to: clientEmail,
        subject: '🎉 New Appointment Added to Your Portal!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
                .content { background: #f8fafc; padding: 40px 30px; }
                .appointment-card { background: white; border-radius: 12px; padding: 25px; margin: 25px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 4px solid #667eea; }
                .appointment-card h2 { color: #1e293b; margin: 0 0 15px 0; font-size: 22px; }
                .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
                .detail-row:last-child { border-bottom: none; }
                .detail-label { font-weight: 600; color: #64748b; min-width: 120px; }
                .detail-value { color: #1e293b; font-weight: 500; }
                .button { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white !important; padding: 16px 32px; text-decoration: none; border-radius: 50px; margin-top: 25px; font-weight: 600; font-size: 16px; }
                .footer { text-align: center; padding: 30px; color: #64748b; font-size: 14px; background: #f8fafc; }
                .excitement-text { background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 20px; font-weight: 700; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Great News, ${clientName}!</h1>
                </div>
                <div class="content">
                  <p class="excitement-text">You have a new appointment scheduled!</p>
                  <p style="font-size: 16px; color: #475569;">Check your Client Portal at <strong>kinectb2b-portal.com</strong> to view your new appointment details.</p>
                  
                  <div class="appointment-card">
                    <h2>📅 ${appointment.company}</h2>
                    <div class="detail-row">
                      <div class="detail-label">📆 Date:</div>
                      <div class="detail-value">${appointment.date}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">🕐 Time:</div>
                      <div class="detail-value">${appointment.time}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">👤 Contact:</div>
                      <div class="detail-value">${appointment.contact}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">📋 Type:</div>
                      <div class="detail-value">${appointment.type}</div>
                    </div>
                    <div class="detail-row">
                      <div class="detail-label">📍 Location:</div>
                      <div class="detail-value">${appointment.location}</div>
                    </div>
                    ${appointment.notes ? `<div class="detail-row"><div class="detail-label">📝 Notes:</div><div class="detail-value">${appointment.notes}</div></div>` : ''}
                  </div>
                  
                  <p style="text-align: center;">
                    <a href="https://kinectb2b-portal.com" class="button">View in Portal →</a>
                  </p>
                </div>
                
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Kinect B2B. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
      })
    });

    const emailData = await emailRes.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data: emailData })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
