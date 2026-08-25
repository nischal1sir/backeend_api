import bcrypt from "bcrypt";
import User, { UserRole } from "../Model/usermodel";

interface SeedAdminResult {
  success: boolean;
  message: string;
  data?: object;
}


const seedAdminUser = async (): Promise<SeedAdminResult> => {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim() || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const adminName = process.env.ADMIN_NAME?.trim() || "System Admin";
  const adminContact = process.env.ADMIN_CONTACT?.trim() || "9812345678";

  const existingAdmin = await User.findOne({ role: UserRole.ADMIN });
  if (existingAdmin) {
    return {
      success: false,
      message: "Admin already exists",
    };
  }
/// findus
  const existingUser = await User.findOne({ userEmail: adminEmail });
  if (existingUser) {
    return {
      success: false,
      message: "A user with this email already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await User.create({
    userName: adminName,
    userEmail: adminEmail,
    userPassword: hashedPassword,
    userContact: adminContact,
    role: UserRole.ADMIN,
    approved: true,
  });

  const adminResponse = admin.toObject();
  delete (adminResponse as { userPassword?: string }).userPassword;

  return {
    success: true,
    message: "Admin user created successfully",
    data: adminResponse,
  };
};

export default seedAdminUser;
