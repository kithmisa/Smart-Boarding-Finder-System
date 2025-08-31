const nodemailer = require('nodemailer');

// Create transporter (you'll need to configure this with your email provider)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send email notification
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to,
      subject: subject,
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('❌ Error sending email to:', to);
    console.error('Error message:', error.message);
    return false;
  }
};

// Send visit request notification to owner
const sendVisitRequestNotification = async (ownerEmail, ownerName, propertyTitle, studentName, requestedDate, requestedTime, message) => {
  
  const subject = `New Visit Request - ${propertyTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Visit Request</h2>
      <p>Hello ${ownerName},</p>
      <p>You have received a new visit request for your property <strong>${propertyTitle}</strong>.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Request Details:</h3>
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Requested Date:</strong> ${new Date(requestedDate).toLocaleDateString()}</p>
        ${requestedTime ? `<p><strong>Requested Time:</strong> ${requestedTime}</p>` : ''}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      </div>
      
      <p>Please log in to your dashboard to respond to this request.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated notification from Smart Boarding Finder System.
        </p>
      </div>
    </div>
  `;
  
  return await sendEmail(ownerEmail, subject, html);
};

// Send visit response notification to student
const sendVisitResponseNotification = async (studentEmail, studentName, propertyTitle, status, ownerResponse, confirmedDate, confirmedTime) => {
  console.log('=== SENDING VISIT RESPONSE NOTIFICATION ===');
  console.log('To:', studentEmail);
  console.log('Student Name:', studentName);
  console.log('Property:', propertyTitle);
  console.log('Status:', status);
  console.log('Owner Response:', ownerResponse);
  console.log('Confirmed Date:', confirmedDate);
  console.log('Confirmed Time:', confirmedTime);
  
  const subject = `Visit Request ${status.charAt(0).toUpperCase() + status.slice(1)} - ${propertyTitle}`;
  
  let statusText, statusColor;
  if (status === 'confirmed') {
    statusText = 'Confirmed';
    statusColor = '#059669';
  } else if (status === 'rejected') {
    statusText = 'Rejected';
    statusColor = '#dc2626';
  } else {
    statusText = 'Updated';
    statusColor = '#2563eb';
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusColor};">Visit Request ${statusText}</h2>
      <p>Hello ${studentName},</p>
      <p>Your visit request for <strong>${propertyTitle}</strong> has been <strong>${statusText.toLowerCase()}</strong>.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Response Details:</h3>
        ${status === 'confirmed' && confirmedDate ? `
          <p><strong>Confirmed Date:</strong> ${new Date(confirmedDate).toLocaleDateString()}</p>
          ${confirmedTime ? `<p><strong>Confirmed Time:</strong> ${confirmedTime}</p>` : ''}
        ` : ''}
        ${ownerResponse ? `<p><strong>Owner's Message:</strong> ${ownerResponse}</p>` : ''}
      </div>
      
      <p>You can view the full details in your profile dashboard.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This is an automated notification from Smart Boarding Finder System.
        </p>
      </div>
    </div>
  `;
  
  console.log('Calling sendEmail function for response notification...');
  const result = await sendEmail(studentEmail, subject, html);
  console.log('sendEmail result for response notification:', result);
  return result;
};

// Send visit confirmation email
const sendVisitConfirmationEmail = async ({ to, userName, propertyTitle, confirmedDate, confirmedTime, ownerMessage }) => {
  const subject = '✅ Visit Request Confirmed - Smart Boarding Finder';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 40px;">
            ✨
          </div>
          <h1 style="color: #333; margin: 20px 0 10px 0;">Visit Request Confirmed!</h1>
          <p style="color: #666; margin: 0;">Your visit has been approved by the property owner</p>
        </div>
        
        <div style="background: #f8fffe; padding: 20px; border-radius: 10px; border-left: 4px solid #10b981; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Visit Details</h3>
          <p style="margin: 8px 0;"><strong>Property:</strong> ${propertyTitle}</p>
          <p style="margin: 8px 0;"><strong>📅 Date:</strong> ${new Date(confirmedDate).toLocaleDateString()}</p>
          <p style="margin: 8px 0;"><strong>⏰ Time:</strong> ${confirmedTime}</p>
          ${ownerMessage ? `<p style="margin: 8px 0;"><strong>💬 Owner Message:</strong> ${ownerMessage}</p>` : ''}
        </div>

        <div style="background: #eff6ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4 style="color: #1e40af; margin-top: 0;">📋 What's Next?</h4>
          <ul style="color: #374151; padding-left: 20px;">
            <li>Mark this date on your calendar</li>
            <li>Contact the owner if you need to reschedule</li>
            <li>Prepare any questions about the property</li>
            <li>Arrive on time for your visit</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #666; font-size: 14px;">
            Need help? Contact us at smartboproject@gmail.com
          </p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail(to, subject, html);
};

// Send visit rejection email
const sendVisitRejectionEmail = async ({ to, userName, propertyTitle, rejectionReason, suggestedDate, suggestedTime }) => {
  const subject = '❌ Visit Request Update - Smart Boarding Finder';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 40px; color: white;">
            😔
          </div>
          <h1 style="color: #333; margin: 20px 0 10px 0;">Visit Request Update</h1>
          <p style="color: #666; margin: 0;">Unfortunately, your visit request has been declined</p>
        </div>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 10px; border-left: 4px solid #ef4444; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Request Details</h3>
          <p style="margin: 8px 0;"><strong>Property:</strong> ${propertyTitle}</p>
          <p style="margin: 8px 0;"><strong>💬 Owner's Message:</strong> ${rejectionReason}</p>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔍 Don't Give Up!</h4>
          <ul style="color: #374151; padding-left: 20px;">
            <li>Try requesting a different date or time</li>
            <li>Browse other similar properties</li>
            <li>Contact the owner directly for more information</li>
            <li>Check our latest listings for new opportunities</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://smartboardingfinder.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            Browse More Properties
          </a>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #666; font-size: 14px;">
            Need help? Contact us at support@smartboardingfinder.com
          </p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendVisitRequestNotification,
  sendVisitResponseNotification,
  sendVisitConfirmationEmail,
  sendVisitRejectionEmail
};
