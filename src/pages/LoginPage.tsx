import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  GraduationCap,
  Shield,
  Wrench,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const authVisualImage = '/src/assets/images/campus_auth_visual_1791949530359.jpg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          const destination = email.includes('admin') ? '/admin/dashboard' : '/student/dashboard';
          navigate(destination);
        } else {
          setError(res.error || 'Authentication failed. Please check your credentials.');
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (!agreeTerms) {
          setError('Please agree to institutional terms and privacy policy.');
          setLoading(false);
          return;
        }

        const res = await register({
          name,
          email,
          password,
          role,
          department,
          studentId: identifier || `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        });

        if (res.success) {
          navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
        } else {
          setError(res.error || 'Could not complete registration.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    switchDemoUser(demoRole);
    if (demoRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Panel: Form */}
        <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                  {mode === 'login' ? 'Welcome Back' : 'Create CampusFix Account'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {mode === 'login'
                    ? 'Enter your institutional email to access complaint tracking'
                    : 'Register with your official student or staff credentials'}
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    mode === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Sarah Chen"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Role
                      </label>
                      <select
                        value={role}
                        onChange={e => setRole(e.target.value as UserRole)}
                        className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Administrator</option>
                        <option value="staff">Facilities Staff</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Student / Staff ID
                      </label>
                      <input
                        type="text"
                        value={identifier}
                        onChange={e => setIdentifier(e.target.value)}
                        placeholder="STU-2024-8821"
                        className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Academic Department / Unit
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science, Architecture"
                      className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
                    />
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student.name@campus.edu"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-[11px] text-[#166534] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534] focus:border-[#166534]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Terms checkbox */}
              {mode === 'register' && (
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#166534] focus:ring-[#166534]"
                  />
                  <label htmlFor="terms" className="text-[11px] text-stone-600 leading-tight">
                    I acknowledge university conduct guidelines, FERPA student privacy rights, and agree to file accurate campus reports.
                  </label>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-[#166534] hover:bg-[#14532d] disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to CampusFix' : 'Complete Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* 1-Click Presentation Demo Switcher */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="text-xs font-semibold text-stone-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Presentation Demo Accounts</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="p-2 rounded-lg bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-stone-800 font-semibold text-xs group-hover:text-[#166534]">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 truncate">Sarah Chen</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2 rounded-lg bg-stone-50 hover:bg-blue-50 border border-stone-200 hover:border-blue-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-stone-800 font-semibold text-xs group-hover:text-blue-700">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 truncate">Marcus Vance</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('staff')}
                className="p-2 rounded-lg bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-1.5 text-stone-800 font-semibold text-xs group-hover:text-amber-700">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  <span>Staff</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 truncate">David Miller</div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Panel: Campus Photography & Mission Overlay */}
        <div className="md:col-span-5 relative bg-[#166534] text-white p-8 flex flex-col justify-between overflow-hidden">
          {/* Background image with green duotone scrim */}
          <img
            src={authVisualImage}
            alt="Modern sustainable university building"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#166534] via-[#166534]/85 to-[#166534]/70" />

          {/* Top badge */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-xs">
              CF
            </span>
            <span className="text-sm font-bold tracking-tight text-white">CampusFix Operations</span>
          </div>

          {/* Center inspirational quote */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
              Student Voice & Transparency
            </div>
            <p className="text-xl font-bold leading-snug">
              “Every broken door, flooded lab, or offline Wi-Fi access point fixed brings our campus one step closer to perfection.”
            </p>
            <div className="text-xs text-emerald-200">
              Campus Facilities & Student Government Alliance
            </div>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
            <span>24/7 University SLA</span>
            <span className="font-mono tabular-nums">98.4% Resolution</span>
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 p-6 max-w-md w-full">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Reset Institutional Password
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter your registered campus email. We will send a secure password reset link to your university inbox.
            </p>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-lg text-xs text-emerald-800 space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Password Reset Email Dispatched</span>
                </div>
                <p>
                  Instructions have been sent to <span className="font-mono">{forgotEmail}</span>. Please check your junk/spam folder if it does not appear within 2 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordOpen(false);
                    setForgotSuccess(false);
                  }}
                  className="w-full py-2 bg-[#166534] text-white text-xs font-semibold rounded-lg hover:bg-[#14532d]"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (forgotEmail) setForgotSuccess(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Campus Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="student.name@campus.edu"
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#166534]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#166534] text-white text-xs font-semibold rounded-lg hover:bg-[#14532d]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
