const API_KEY = 'YOUR_API_KEY_HERE';
const ADMIN_EMAIL = 'info@immihire.com';
const SENDER_EMAIL = 'no-reply@immihire.com';

// --- HELPER: GENERATE ID ---
function generateTrackingId() {
    return 'IMH-' + Date.now().toString().slice(-4) + Math.floor(Math.random() * 1000);
}

// --- HELPER: SEND EMAIL ---
async function sendEmail(toEmail, toName, subject, htmlContent) {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "ImmiHire Alerts", email: SENDER_EMAIL },
                to: [{ email: toEmail, name: toName }],
                subject: subject,
                htmlContent: htmlContent
            })
        });
        return response.ok;
    } catch (e) {
        console.error(e);
        return false;
    }
}

// --- 1. NEWSLETTER HANDLER ---
async function handleNewsletter(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button');
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value;
    const originalText = btn.innerText;

    btn.innerText = "Subscribing...";

    // Admin Notification
    const adminHtml = `<div style='font-family:sans-serif; padding:20px; border:1px solid #eee;'><h3>New Subscriber</h3><p><strong>Email:</strong> ${email}</p></div>`;

    // User Confirmation
    const userHtml = `
    <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #0d5fb7;">
            <h1 style="color: #0d5fb7; margin: 0;">ImmiHire <span style="color: #000;">Insights</span></h1>
        </div>
        <div style="padding: 30px 0;">
            <h2 style="color: #333;">Welcome to the Dispatch</h2>
            <p style="color: #555; line-height: 1.6;">You have successfully subscribed to our newsletter. You will now receive critical updates on global immigration policies, visa trends, and exclusive guides.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px;">
            &copy; 2025 ImmiHire Management Consultancy. Dubai, UAE.
        </div>
    </div>`;

    await Promise.all([
        sendEmail(ADMIN_EMAIL, "Admin", "New Newsletter Subscriber", adminHtml),
        sendEmail(email, "Subscriber", "Welcome to ImmiHire Insights", userHtml)
    ]);

    alert("Successfully Subscribed!");
    btn.innerText = originalText;
    form.reset();
}

// --- 2. HOME FORM HANDLER ---
async function handleHomeForm(e) {
    e.preventDefault();
    const btn = document.querySelector('#home-form-btn') || e.target.querySelector('button');
    const originalText = btn.innerText;
    const refId = generateTrackingId();

    // Gather Data
    const fname = document.getElementById('home-fname').value;
    const lname = document.getElementById('home-surname').value;
    const email = document.getElementById('home-email').value;
    const phone = document.getElementById('home-phone').value;
    const dest = document.getElementById('home-dest').value;
    const res = document.getElementById('home-res') ? document.getElementById('home-res').value : 'Not specified';
    const job = document.getElementById('home-job') ? document.getElementById('home-job').value : 'Not specified';
    const edu = document.getElementById('home-edu') ? document.getElementById('home-edu').value : 'Not specified';

    btn.innerText = "Processing...";

    // Admin Template
    const adminHtml = `
    <div style="font-family:sans-serif; border:1px solid #ccc; padding:20px;">
        <h2 style="color:#0d5fb7;">Consultation Request (${refId})</h2>
        <p><strong>Name:</strong> ${fname} ${lname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <hr>
        <p><strong>Destination:</strong> ${dest}</p>
        <p><strong>Residence:</strong> ${res}</p>
        <p><strong>Occupation:</strong> ${job}</p>
        <p><strong>Education:</strong> ${edu}</p>
    </div>`;

    // User Template
    const userHtml = `
    <div style="font-family:sans-serif; padding:20px;">
        <h2>Request Received</h2>
        <p>Dear ${fname},</p>
        <p>We have received your consultation request for <strong>${dest}</strong>.</p>
        <p style="background:#f0f9ff; padding:10px; border-left:4px solid #0d5fb7;">Reference ID: <strong>${refId}</strong></p>
        <p>Our team will review your profile (${job}) and contact you shortly.</p>
        <p>Regards,<br>ImmiHire Team</p>
    </div>`;

    await Promise.all([
        sendEmail(ADMIN_EMAIL, "Admin", `New Lead: ${fname} - ${dest}`, adminHtml),
        sendEmail(email, fname, `Consultation Request Received: ${refId}`, userHtml)
    ]);

    alert(`Success! Your Reference ID is ${refId}. We will contact you shortly.`);
    btn.innerText = originalText;
    e.target.reset();
}

// --- 3. CONTACT FORM HANDLER ---
async function handleContactForm(e) {
    e.preventDefault();
    const btn = document.getElementById('send-btn') || e.target.querySelector('button');
    const refId = generateTrackingId();
    const fname = document.getElementById('contact-fname').value;
    const lname = document.getElementById('contact-lname').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const msg = document.getElementById('contact-message').value;

    if (btn) btn.classList.add('flying');

    const adminHtml = `
    <div style="font-family:sans-serif; padding:20px;">
        <h2 style="color:#0d5fb7;">New Inquiry (${refId})</h2>
        <p><strong>Sender:</strong> ${fname} ${lname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <div style="background:#eee; padding:15px; margin-top:10px;">${msg}</div>
    </div>`;

    const userHtml = `
    <div style="font-family:sans-serif; padding:20px;">
        <h2>We received your message</h2>
        <p>Hello ${fname},</p>
        <p>Thank you for contacting ImmiHire. This is an automated confirmation that your message has been logged.</p>
        <p><strong>Ticket ID:</strong> ${refId}</p>
        <p>We will reply to this email address shortly.</p>
    </div>`;

    await Promise.all([
        sendEmail(ADMIN_EMAIL, "Admin", `Contact: ${fname}`, adminHtml),
        sendEmail(email, fname, `We received your message: ${refId}`, userHtml)
    ]);

    setTimeout(() => {
        alert("Message Sent Successfully!");
        if (btn) btn.classList.remove('flying');
        e.target.reset();
    }, 2000);
}

// --- 4. SERVICES FORM HANDLER (Fabrication Station) ---
async function handleServiceForm(e, serviceName) {
    e.preventDefault();
    const btn = document.getElementById('service-submit-btn') || e.target.querySelector('button');
    const refId = generateTrackingId();
    const name = document.getElementById('input-name').value;
    const surname = document.getElementById('input-surname').value;
    const email = document.getElementById('input-email').value;
    const country = document.getElementById('input-country').value;
    const dob = document.getElementById('input-dob') ? document.getElementById('input-dob').value : 'Not specified';

    if (btn) btn.innerText = "Processing...";

    const adminHtml = `
    <div style="font-family:sans-serif; padding:20px;">
        <h2 style="color:#10b981;">New Application (${refId})</h2>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Applicant:</strong> ${name} ${surname}</p>
        <p><strong>Nationality:</strong> ${country}</p>
        <p><strong>DOB:</strong> ${dob}</p>
        <p><strong>Email:</strong> ${email}</p>
    </div>`;

    const userHtml = `
    <div style="font-family:sans-serif; padding:20px;">
        <h2 style="color:#10b981;">Application Submitted</h2>
        <p>Dear ${name},</p>
        <p>Your preliminary application for <strong>${serviceName}</strong> has been securely transmitted.</p>
        <div style="text-align:center; padding:20px; background:#f8f9fa; margin:20px 0;">
            <span style="display:block; font-size:12px; color:#888;">TRACKING ID</span>
            <span style="display:block; font-size:24px; font-weight:bold; letter-spacing:2px; color:#0d5fb7;">${refId}</span>
        </div>
        <p>You can use this ID to check your status with our team.</p>
    </div>`;

    await Promise.all([
        sendEmail(ADMIN_EMAIL, "Admin", `App: ${serviceName} - ${name}`, adminHtml),
        sendEmail(email, name, `Application Status: ${serviceName}`, userHtml)
    ]);

    window.location.href = `success.html?id=${refId}`;
}

// --- 5. UNIFIED APP HANDLER (Work Abroad) ---
async function handleUnifiedApp(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : "Submit";
    const refId = generateTrackingId();

    // Gather Data
    const name = document.getElementById('app-name').value;
    const phone = document.getElementById('app-phone').value;
    const email = document.getElementById('app-email').value;
    const country = document.getElementById('app-country').value;
    const visa = document.getElementById('app-visa').value;
    const position = document.getElementById('app-position').value;
    const exp = document.getElementById('app-exp').value;
    const passport = document.querySelector('input[name="passport"]:checked') ? document.querySelector('input[name="passport"]:checked').value : 'No';
    const msg = document.getElementById('app-msg').value;

    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // Admin Template
    const adminHtml = `
    <div style="font-family:sans-serif; padding:20px; border:1px solid #e5e7eb;">
        <h2 style="color:#0d5fb7;">Details (${refId})</h2>
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Applicant:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${name}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${email}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Phone:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${phone}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Target Country:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${country}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Visa Type:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${visa}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Position:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${position}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Experience:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${exp}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Passport:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${passport}</td></tr>
        </table>
        <div style="background:#f9fafb; padding:15px; margin-top:20px; border-radius:8px;">
            <strong>Message:</strong><br>${msg}
        </div>
    </div>`;

    // User Template
    const userHtml = `
    <div style="font-family:sans-serif; padding:20px;">
        <h2 style="color:#0d5fb7;">Application Received</h2>
        <p>Dear ${name},</p>
        <p>We have successfully received your application for <strong>${country} (${visa})</strong>.</p>
        <p><strong>Position:</strong> ${position}</p>
        <div style="text-align:center; padding:20px; background:#f0f9ff; margin:20px 0; border-radius:10px;">
            <span style="display:block; font-size:12px; color:#64748b;">REFERENCE ID</span>
            <span style="display:block; font-size:24px; font-weight:bold; letter-spacing:2px; color:#0d5fb7;">${refId}</span>
        </div>
        <p>Our recruitment team will review your profile and contact you within 48 hours for the next steps.</p>
        <p>Best regards,<br>The ImmiHire Team</p>
    </div>`;

    await Promise.all([
        sendEmail(ADMIN_EMAIL, "Admin", `Job App: ${name} -> ${country}`, adminHtml),
        sendEmail(email, name, `Application Confirmed: ${country}`, userHtml)
    ]);

    window.location.href = `success.html?id=${refId}`;
}
