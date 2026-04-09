const PaymentMethods = () => {
  const cards = [
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiry: '12/26',
      holder: 'Alex Thompson',
      isDefault: true,
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjq08cnjc6j9Bys3z9NTXuDE4pg0_a4G0IO1IOa4EQRBuBMZMgdTdsYDRSLLKni-xpyKUM2SHKER88I_Kb_cHCqlwkFLQ8iu6Ye7HPqjV6khYoV52n4S3ep0ETubKBRUPQdr6Emdd8v3os4N1V-cwfDR0Pjb5zNAXuH9mCrLo4ZNwU_qjMRGyM8wJ-xvZlz-QhLScLcJuod7rVLJDm2T7mfg4yLeDuUqdDQ4H_on3XH7GO29adNhUuY9Noz09o6JN7-o2JPRahk-_3'
    },
    {
      id: '2',
      type: 'Mastercard',
      last4: '5555',
      expiry: '08/25',
      holder: 'Alex Thompson',
      isDefault: false,
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqiQXDk1z2hXzin41U0dEKFl-6VktbD_WrkpYvLgtiEE_HDe8sHnn-HkYL1qZS0AIlePBfPodd0cE8qF_K5K2G0Py2QT1gKaIuTxpzIsXFs5wVL4C5US-EeFMr8ycENW2605g3pRNNzfezKbAl5cITdOguIaapQZZuZD0_T-s_G0VQWXBILgOBygWX5Xjai_NqQXukSwNKOmXGTM4Lw_O0bxDUq1GOCfuGZMDgnBu_OkbTzzDFmiIpMMRVIyOWQa_LBsua7F2cYe9Q'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Heading Section */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Payment Methods</h1>
          <p className="text-slate-500">Securely manage your saved cards and billing preferences.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
          <span className="material-symbols-outlined text-[18px]">add_card</span>
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Card List */}
      <div className="grid gap-4">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col md:flex-row items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-primary/30 transition-all">
            <div className="w-16 h-10 rounded-md bg-slate-50 flex items-center justify-center p-2 shrink-0 border border-slate-100">
              <img src={card.logo} alt={card.type} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <p className="text-base font-bold text-slate-900">{card.type} ending in {card.last4}</p>
                {card.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-200">Default</span>
                )}
              </div>
              <p className="text-sm text-slate-500">Expires {card.expiry} • {card.holder}</p>
            </div>
            <div className="flex items-center gap-3">
              {!card.isDefault && (
                <button className="text-xs font-bold text-primary hover:underline px-2">Set as default</button>
              )}
              <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}

        {/* Digital Wallet Option */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm opacity-80">
          <div className="w-16 h-10 rounded-md bg-white flex items-center justify-center p-2 shrink-0 border border-slate-100">
            <span className="material-symbols-outlined text-slate-700">account_balance_wallet</span>
          </div>
          <div className="flex-1 flex flex-col justify-center text-center md:text-left">
            <p className="text-base font-bold text-slate-900">Digital Wallet</p>
            <p className="text-sm text-slate-500">Apple Pay linked (•••• 9012)</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-colors">
              <span className="material-symbols-outlined">link_off</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 flex gap-4">
        <span className="material-symbols-outlined text-primary">security</span>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-slate-900">Secure Payment Processing</h3>
          <p className="text-xs leading-relaxed text-slate-600">
            Urban Thread uses industry-standard 256-bit encryption to protect your data. We never store your full card number on our servers. Your information is tokenized and processed by our secure payment partners.
          </p>
        </div>
      </div>

      {/* Empty State Illustration Placeholder */}
      <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-3xl">
        <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-primary text-4xl">payments</span>
        </div>
        <h4 className="text-lg font-bold">New Card?</h4>
        <p className="text-sm text-slate-500 mb-6 text-center">Add more payment methods for a faster checkout experience.</p>
        <button className="px-6 py-2 border border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
          Explore Payment Options
        </button>
      </div>
    </div>
  );
};

export default PaymentMethods;
