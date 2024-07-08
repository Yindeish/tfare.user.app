interface IFlutterwaveWallet {
    walletId: string;
    userId: string;
    balance: number;
    currency: string;
    transactionHistory: ITransaction[];
    status: 'active' | 'inactive' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
    walletType: 'personal' | 'business';
    linkedAccounts: ILinkedAccount[];
    securitySettings: ISecuritySettings;
    limits: IWalletLimits;
    fees: IWalletFees;
    notifications: INotificationSettings;
    beneficiaries: IBeneficiary[];
}

interface ITransaction {
    transactionId: string;
    type: 'deposit' | 'withdrawal' | 'transfer';
    amount: number;
    currency: string;
    date: Date;
    status: 'pending' | 'completed' | 'failed';
    description?: string;
}

interface ILinkedAccount {
    accountId: string;
    accountType: 'bank' | 'card';
    accountNumber: string;
    bankName?: string;
    cardType?: string;
    cardLastFourDigits?: string;
}

interface ISecuritySettings {
    pin: string;
    twoFactorEnabled: boolean;
    twoFactorMethod?: 'sms' | 'email' | 'authenticator';
}

interface IWalletLimits {
    dailyLimit: number;
    monthlyLimit: number;
}

interface IWalletFees {
    transactionFee: number;
    withdrawalFee: number;
}

interface INotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
}

interface IBeneficiary {
    beneficiaryId: string;
    name: string;
    accountNumber: string;
    bankName: string;
    addedAt: Date;
}

export type { IBeneficiary, IFlutterwaveWallet, ILinkedAccount, INotificationSettings, ISecuritySettings, ITransaction, IWalletFees, IWalletLimits, }