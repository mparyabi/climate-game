export async function sendOtp(mobile, otp) {
    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      throw new Error("شماره موبایل معتبر نیست");
    }
  
    if (!otp) {
      throw new Error("otp دریافت نشد");
    }
  
    const params = new URLSearchParams();
    params.append("username", process.env.MELLIPAYAMAK_USERNAME);
    params.append("password", process.env.MELLIPAYAMAK_PASSWORD);
    params.append("to", mobile);
    params.append("text", `${otp}`);
    params.append("bodyId", 376705);
  
    const response = await fetch("https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  
    const resultText = await response.text();
    console.log("MELLIPAYAMAK response:", resultText);
  
    if (!response.ok) {
      return { success: false, message: resultText };
    }
  
    return { success: true, otp };
  }
  