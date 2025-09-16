import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function sendRegistrationEmail({
  email,
  name,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  eventUrl,
  eventDescription,
  eventHighlights = [
    "Cutting-edge Web3 insights and trends",
    "Networking with Africa's top blockchain innovators",
    "Hands-on workshops and technical sessions",
    "Exclusive access to funding opportunities"
  ],
  organizerName = "HostIt",
  websiteUrl = "https://hostit.events/fuel-africa/event",
}: {
  email: string;
  name: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventUrl: string;
  eventDescription?: string;
  eventHighlights?: string[];
  organizerName?: string;
  supportEmail?: string;
  websiteUrl?: string;
}) {

  await resend.emails.send({
    from: "HostIt Events <noreply@hostit.events>",
    to: email,
    subject: `🚀 Welcome to ${eventName} - Registration Confirmed!`,
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #131939; padding: 40px; min-height: 100vh;">
        <table style="max-width: 600px; margin: auto; background-color: #1a1f3a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
          <tr style="background: linear-gradient(135deg, #007CFA 0%, #0056b3 100%);">
            <td style="text-align: center; padding: 40px 20px;">
                <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; display: inline-block;">
                  <img src="${websiteUrl}/logo.png" alt="HostIT Logo" style="height: 40px; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" />
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">${eventName}</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 5px 0 0 0; font-size: 14px;">Hosted on ${organizerName}</p>
                </div>
              </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #007CFA, #00a8ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 48px; margin-bottom: 10px;">🎉</div>
                <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; line-height: 1.2;">Registration Successful!</h2>
              </div>
              
              <div style="background-color: #131939; border-radius: 8px; padding: 25px; margin: 25px 0; border-left: 4px solid #007CFA;">
                <p style="font-size: 18px; color: #ffffff; margin: 0 0 15px 0;">Hi <strong style="color: #007CFA;">${name}</strong>,</p>
                <p style="font-size: 16px; color: #C8C8C8; line-height: 1.6; margin: 0;">${eventDescription || `Welcome to <strong style="color: #007CFA;">${eventName}</strong>! 🚀 We're thrilled to have you join us.`}</p>
              </div>

              <div style="background: linear-gradient(135deg, rgba(0, 124, 250, 0.1), rgba(0, 168, 255, 0.05)); border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid rgba(0, 124, 250, 0.2);">
                <h3 style="color: #007CFA; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">📅 Event Details</h3>
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; align-items: center;">
                    <span style="color: #007CFA; font-size: 18px; margin-right: 12px;">📅</span>
                    <span style="color: #ffffff; font-weight: 600; margin-right: 8px;">Date:</span>
                    <span style="color: #C8C8C8;">${eventDate}</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="color: #007CFA; font-size: 18px; margin-right: 12px;">⏰</span>
                    <span style="color: #ffffff; font-weight: 600; margin-right: 8px;">Time:</span>
                    <span style="color: #C8C8C8;">${eventTime}</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="color: #007CFA; font-size: 18px; margin-right: 12px;">📍</span>
                    <span style="color: #ffffff; font-weight: 600; margin-right: 8px;">Location:</span>
                    <span style="color: #C8C8C8;">${eventLocation}</span>
                  </div>
                </div>
              </div>

              <div style="background-color: rgba(0, 124, 250, 0.05); border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid rgba(0, 124, 250, 0.1);">
                <h4 style="color: #007CFA; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">🔥 What to Expect:</h4>
                <ul style="color: #C8C8C8; margin: 0; padding-left: 20px; line-height: 1.8;">
                  ${eventHighlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
              </div>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${eventUrl}" style="background: linear-gradient(135deg, #007CFA 0%, #0056b3 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(0, 124, 250, 0.3); transition: all 0.3s ease;">
                  🎯 View Event Details
                </a>
              </div>

              <div style="background-color: #131939; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <p style="color: #C8C8C8; margin: 0 0 10px 0; font-size: 14px;">Questions? We're here to help!</p>
                <p style="color: #007CFA; margin: 0; font-size: 14px; font-weight: 500;"> 🌐 ${websiteUrl}</p>
              </div>
            </td>
          </tr>
          <tr style="background-color: #0f1429;">
            <td style="padding: 25px; text-align: center;">
              <div style="border-top: 1px solid rgba(0, 124, 250, 0.2); padding-top: 20px;">
                <p style="color: #007CFA; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${organizerName}</p>
                <p style="color: #C8C8C8; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} HostIt. All rights reserved.</p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
}
