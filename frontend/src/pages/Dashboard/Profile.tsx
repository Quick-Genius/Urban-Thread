const Profile = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-2">Manage your personal information and security preferences.</p>
      </div>

      {/* Profile Information Section */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 lg:p-8 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
          <p className="text-sm text-slate-500">Your basic information visible to the support team.</p>
        </div>
        <div className="p-6 lg:p-8 space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 border-4 border-slate-100"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDx9edJdRf9FZVmIogV0H6Da-n_eKynaIdkRS3Z-Lo0vAXNMiXtadkWOSvU-1KCjsrrQSJcx43pgqzz6yt_SETFOEvaxj33wfOeGUmRcc-MtKd-AK6q4H6zdZw1M_KXOSU7NdQPVKGwExLAyDDcItxk9JYvTKi4lO3GCbXei5PPQxhgbxK0c_oYd_AUe4zM0NtCen9FX6pv-btbDhQcD9RT13bu0hkMmx_SPlFcCcRB9oJ26NgP265t7Cq5gBemraWzTO_pjZeWd3pM')` }}
              ></div>
              <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white hover:scale-110 transition-transform shadow-lg">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <div className="text-center sm:text-left">
              <button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors mb-2">
                Upload New Photo
              </button>
              <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 2MB.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input className="rounded-lg border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary h-12 px-4 transition-all" type="text" defaultValue="Alex Johnson"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <input className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-500 h-12 px-4 cursor-not-allowed" disabled type="email" defaultValue="alex.johnson@example.com"/>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <input className="rounded-lg border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary h-12 px-4 transition-all" type="tel" defaultValue="+1 (555) 000-0000"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Location</label>
              <input className="rounded-lg border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary h-12 px-4 transition-all" placeholder="e.g. New York, USA" type="text"/>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Change Password Section */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 lg:p-8 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Security</h2>
          <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
        </div>
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Current Password</label>
            <input className="rounded-lg border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary h-12 px-4 transition-all" placeholder="••••••••" type="password"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">New Password</label>
              <input className="rounded-lg border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary h-12 px-4 transition-all" placeholder="••••••••" type="password"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
              <input className="rounded-lg border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-primary h-12 px-4 transition-all" placeholder="••••••••" type="password"/>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-slate-500">Password must be at least 8 characters long.</p>
            <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:brightness-110 transition-all">
              Update Password
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl border border-red-200 bg-red-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-700">Delete Account</h3>
          <p className="text-xs text-red-600/70 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
        </div>
        <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
          Deactivate
        </button>
      </div>
    </div>
  );
};

export default Profile;
