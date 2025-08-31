const db = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Admin login
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt", { username, password });

  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE username = ? AND password = ?", [username, password]);

    if (rows.length === 1) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Get all owners
const getAllOwners = async (req, res) => {
  try {
    const [owners] = await db.query("SELECT * FROM owner");
    res.json({ success: true, owners });
  } catch (err) {
    console.error("Error fetching owners:", err);
    res.status(500).json({ success: false, message: "Error fetching owner" });
  }
};

// Get all user comments
const getAllComments = async (req, res) => {
  try {
    const [comments] = await db.query("SELECT * FROM contact_messages");
    res.json({ success: true, comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ success: false, message: "Error fetching comments" });
  }
};

// Get all houses
/*const getAllHouses = async (req, res) => {
  try {
    const [houses] = await db.query("SELECT * FROM houses");
    res.json({ success: true, houses });
  } catch (err) {
    console.error("Error fetching houses:", err);
    res.status(500).json({ success: false, message: "Error fetching houses" });
  }
};*/

// Get all boarding houses
const getAllHouses = async (req, res) => {
  try {
    
    const [houses] = await db.query(`
      SELECT h.*, o.name as owner_name 
      FROM houses h 
      LEFT JOIN owner o ON h.owner_id = o.id 
      ORDER BY h.created_at DESC
    `);
    res.json({ success: true, houses });
  } catch (err) {
    console.error("Error fetching boarding houses:", err);
    res.status(500).json({ success: false, message: "Error fetching boarding houses" });
  }
};


const confirmHouse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE houses SET status = 'confirmed', confirmed = 1, confirmed_at = NOW() WHERE id = ?", 
      [id]
    );
    res.json({ success: true, message: "Boarding house confirmed successfully" });
  } catch (err) {
    console.error("Error confirming boarding house:", err);
    res.status(500).json({ success: false, message: "Error confirming boarding house" });
  }
};




const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

// Delete owner by id
const deleteOwner = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM owner WHERE id = ?", [id]);
    res.json({ success: true, message: "Owner deleted" });
  } catch (err) {
    console.error("Error deleting owner:", err);
    res.status(500).json({ success: false, message: "Error deleting owner" });
  }
};

// Delete comment by id
const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM contact_messages WHERE id = ?", [id]);
    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ success: false, message: "Error deleting comment" });
  }
};

// Delete house by id
const deleteHouse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM houses WHERE id = ?", [id]);
    res.json({ success: true, message: "House deleted" });
  } catch (err) {
    console.error("Error deleting house:", err);
    res.status(500).json({ success: false, message: "Error deleting house" });
  }
};

const replyToComment = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  
  if (!reply || !reply.trim()) {
    return res.status(400).json({ success: false, message: 'Reply content is required' });
  }
  
  try {
    // Get the existing message
    const [messages] = await db.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );
    
    if (messages.length === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    const message = messages[0];
    
    // Determine if this is an additional reply
    const isAdditional = message.reply ? true : false;
    
    // Construct the new reply content
    let newReply;
    let emailSubject;
    
    if (isAdditional) {
      newReply = `${message.reply}\n\n--- Additional Reply ---\n${reply}`;
      emailSubject = `Re: ${message.title} - Additional Response - Smart Boarding Finder`;
    } else {
      newReply = reply;
      emailSubject = `Re: ${message.title} - Smart Boarding Finder`;
    }
    
    // Update the database
    await db.query(
      'UPDATE contact_messages SET reply = ?, replied = 1, replied_at = NOW() WHERE id = ?',
      [newReply, id]
    );
    
    // Send email notification
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: {
        	name: 'Smart Boarding Finder',
        	address: process.env.EMAIL_USER
        },
        to: message.email,
        replyTo: process.env.REPLY_TO_EMAIL || process.env.EMAIL_USER,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Smart Boarding Finder</h1>
              <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Response</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${message.name || 'there'}!</h2>
              
              <p style="font-size: 16px; margin: 0; color: #6a1b9a;">
                ${isAdditional ? 'Here is an additional response to your inquiry:' : 'Thank you for contacting us. Here is our response to your inquiry:'}
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <p style="font-size: 16px; margin: 0; color: #6a1b9a;"><strong>${isAdditional ? 'Additional Response:' : 'Our Response:'}</strong></p>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #424242; white-space: pre-wrap;">${reply}</p>
              </div>
              
              ${isAdditional && message.reply ? `
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107;">
                <p style="font-size: 16px; margin: 0; color: #856404;"><strong>Previous Response:</strong></p>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #424242;">${message.reply}</p>
              </div>
              ` : ''}
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                <p style="font-size: 16px; margin: 0; color: #28a745;"><strong>Your Original Message:</strong></p>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #424242;"><strong>Subject:</strong> ${message.title}</p>
                <p style="font-size: 14px; margin: 10px 0 0 0; color: #424242;">${message.comments}</p>
              </div>
              
              <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
                If you have any further questions, please don't hesitate to contact us again.
              </p>
              
              <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">
                Best regards,<br>
                <strong>Smart Boarding Finder Team</strong>
              </p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${message.email}`);
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Don't fail the request if email fails, just log it
    }
    
    const responseMessage = isAdditional
      ? "Additional reply sent successfully and email notification delivered"
      : "Reply sent successfully and email notification delivered";
    
    res.json({ success: true, message: responseMessage });
    
  } catch (error) {
    console.error('❌ Error replying to comment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark all unread messages as read
const markAllMessagesAsRead = async (req, res) => {
  const { messageIds } = req.body;
  
  if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
    return res.status(400).json({ success: false, message: "Message IDs array is required" });
  }
  
  try {
    // Update all specified messages to mark them as read
    const placeholders = messageIds.map(() => '?').join(',');
    await db.query(
      `UPDATE contact_messages SET replied = 1, replied_at = NOW() WHERE id IN (${placeholders})`,
      messageIds
    );
    
    console.log(`✅ Marked ${messageIds.length} messages as read`);
    res.json({ success: true, message: `${messageIds.length} messages marked as read successfully` });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ success: false, message: "Error marking messages as read" });
  }
};

// Sync email replies from IMAP inbox and attach to matching contact messages
const syncEmailReplies = async (req, res) => {
  const { ImapFlow } = require('imapflow');
  const { simpleParser } = require('mailparser');

  const host = process.env.IMAP_HOST || 'imap.gmail.com';
  const port = Number(process.env.IMAP_PORT || 993);
  const user = process.env.IMAP_USER || process.env.EMAIL_USER;
  const pass = process.env.IMAP_PASS || process.env.EMAIL_PASS;
  const includeSeen = (req.query && req.query.includeSeen === 'true') || (req.body && req.body.includeSeen === true);
  const fallbackLatest = (req.query && req.query.fallbackLatest === 'true') || (req.body && req.body.fallbackLatest === true);

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass }
  });

  let processed = 0;
  let matched = 0;
  try {
    await client.connect();
    await client.mailboxOpen('INBOX');

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const searchCriteria = includeSeen ? { since } : { seen: false, since };
    const uids = await client.search(searchCriteria);

    for (const uid of uids) {
      try {
        const data = await client.fetchOne(uid, { envelope: true, source: true, headers: true });
        if (!data) continue;

        const envelope = data.envelope || {};
        const source = data.source;
        const parsed = await simpleParser(source);

        const fromAddress = (envelope.from && envelope.from[0] && envelope.from[0].address)
          ? envelope.from[0].address.toLowerCase()
          : (parsed.from && parsed.from.value && parsed.from.value[0] && parsed.from.value[0].address
            ? parsed.from.value[0].address.toLowerCase()
            : null);

        const subject = (envelope.subject || parsed.subject || '').toString();
        const plainText = (parsed.text || '').trim();

        if (!fromAddress || !plainText) {
          await client.messageFlagsAdd(uid, ['\\Seen']);
          processed++;
          continue;
        }

        // Find most recent contact messages for this sender
        const [rows] = await db.query(
          'SELECT id, title, reply FROM contact_messages WHERE LOWER(email) = ? ORDER BY created_at DESC LIMIT 10',
          [fromAddress]
        );

        let target = null;
        const normalizedSubject = subject.toLowerCase();
        for (const row of rows) {
          const title = (row.title || '').toLowerCase();
          if (!title) continue;
          // Match if subject contains original title (common for "Re: title")
          if (normalizedSubject.includes(title)) {
            target = row;
            break;
          }
        }

        // Fallback: if only one message from sender exists, use it
        if (!target && rows.length === 1) {
          target = rows[0];
        }
        // Optional fallback: if multiple exist and no subject match, pick most recent
        if (!target && fallbackLatest && rows.length > 0) {
          target = rows[0]; // rows ordered by created_at DESC
        }

        if (target) {
          // Basic dedupe: avoid appending exact same text if already included
          const existing = (target.reply || '');
          const sample = plainText.substring(0, 120);
          if (!existing.includes(sample)) {
            const divider = '\n\n--- User Reply (' + new Date().toISOString() + ') ---\n';
            const newReply = (existing ? (existing + divider + plainText) : plainText);
            await db.query(
              'UPDATE contact_messages SET reply = ?, replied = 1, replied_at = NOW() WHERE id = ?',
              [newReply, target.id]
            );
            matched++;
          }
        }

        // Mark message as seen to avoid reprocessing
        await client.messageFlagsAdd(uid, ['\\Seen']);
        processed++;
      } catch (innerErr) {
        console.error('Error processing email uid', uid, innerErr);
      }
    }

    res.json({ success: true, message: `Synced emails. Processed: ${processed}, matched to messages: ${matched}` });
  } catch (err) {
    console.error('❌ IMAP sync failed:', err);
    res.status(500).json({ success: false, message: 'IMAP sync failed', error: err.message });
  } finally {
    try { await client.logout(); } catch (e) {}
  }
};

module.exports = {
  loginAdmin,
  getAllUsers,  
  getAllOwners,
  getAllComments,
  getAllHouses,
  confirmHouse,
  deleteUser,  
  deleteOwner,
  deleteComment,
  deleteHouse,
  replyToComment,
  markAllMessagesAsRead,
  syncEmailReplies
};
