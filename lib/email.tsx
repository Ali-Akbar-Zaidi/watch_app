import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init('jZlXlOL2GzF-y1CkL');

const SERVICE_ID = 'service_aoob5b3';
const TEMPLATE_ID = 'template_x3lfwzn';

interface EmailParams {
  to_name: string;
  to_email: string;
  product_name: string;
  product_description: string;
  product_price: string;
  product_image: string;
}

const sendWithRetry = async (params: EmailParams, retries = 3): Promise<boolean> => {
  try {
    if (!SERVICE_ID || !TEMPLATE_ID) {
      throw new Error('EmailJS service or template ID not configured');
    }

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        ...params,
        from_name: 'Beguiling Chronos',
      }
    );

    if (result.status !== 200) {
      throw new Error(`EmailJS returned status ${result.status}`);
    }

    return true;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying email send (${retries} attempts left)...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return sendWithRetry(params, retries - 1);
    }
    throw error;
  }
};

export const sendProductNotification = async (params: EmailParams): Promise<{success: boolean, error?: string}> => {
  try {
    const success = await sendWithRetry(params);
    return { success };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown email error';
    console.error('Failed to send email:', errorMsg);
    return { success: false, error: errorMsg };
  }
};