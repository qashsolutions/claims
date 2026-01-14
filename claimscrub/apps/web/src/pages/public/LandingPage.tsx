import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Shield,
  Zap,
  Brain,
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  Minus,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * LandingPage - Denali Health flagship public landing page
 *
 * Professional-grade marketing page featuring:
 * - Hero with animated demo preview
 * - Problem/Solution narrative
 * - Feature showcase with icons
 * - How it works flow
 * - Pricing with comparison
 * - Testimonials and social proof
 * - FAQ accordion
 * - Footer with CTAs
 *
 * Design System: Amber-600 primary, Sage success, Rose error, Slate neutral
 * Typography: Merriweather (headings), Inter (body)
 */

// ============================================================================
// NAVIGATION
// ============================================================================

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-neutral-900">
              Denali Health
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Testimonials
            </a>
            <a href="#faq" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              FAQ
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-600"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-neutral-100">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-neutral-600 hover:text-neutral-900">Features</a>
              <a href="#pricing" className="text-neutral-600 hover:text-neutral-900">Pricing</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-neutral-900">Testimonials</a>
              <a href="#faq" className="text-neutral-600 hover:text-neutral-900">FAQ</a>
              <hr className="border-neutral-200" />
              <Link to="/login" className="text-neutral-700 font-medium">Log in</Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-lg"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-b from-amber-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                <Zap className="h-4 w-4" />
                Denials Management for Providers
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Powered by Claude for Healthcare from Anthropic
              </p>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
              Denials{' '}
              <span className="text-amber-600">Prevention</span>,{' '}
              Not Denials Management
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-xl mx-auto lg:mx-0">
              Denali Health validates your medical claims in real-time, preventing denials
              and recovering revenue with AI-powered precision.
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-8">
              <div>
                <p className="text-3xl font-bold text-neutral-900">94%</p>
                <p className="text-sm text-neutral-500">Denial Prevention</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">$127K</p>
                <p className="text-sm text-neutral-500">Avg. Annual Savings</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">&lt;2min</p>
                <p className="text-sm text-neutral-500">Per Claim</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/30"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <p className="mt-8 text-sm text-neutral-500">
              No credit card required · HIPAA compliant · Setup in 5 minutes
            </p>
          </div>

          {/* Right: Demo Preview */}
          <div className="relative">
            {/* Browser Frame */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-100 border-b border-neutral-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white rounded-md text-xs text-neutral-500">
                    app.claimscrub.com
                  </div>
                </div>
              </div>

              {/* App Preview */}
              <div className="p-6">
                {/* Validation Result Card */}
                <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-700">PASS</span>
                        <span className="px-2 py-0.5 bg-green-200 text-green-800 text-sm font-medium rounded-md">
                          Score: 98/100
                        </span>
                      </div>
                      <p className="mt-1 text-green-700">Maria Santos · CLM-2026-0112</p>
                    </div>
                  </div>
                </div>

                {/* Validation Checks */}
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'CPT-ICD Match', status: 'pass' },
                    { label: 'Provider NPI Verified', status: 'pass' },
                    { label: 'Prior Authorization', status: 'pass' },
                    { label: 'NCCI Edits Clear', status: 'pass' },
                  ].map((check, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-lg border border-neutral-200"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-neutral-700">{check.label}</span>
                      <span className="ml-auto text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                        PASS
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -left-8 top-1/4 p-4 bg-white rounded-xl shadow-lg border border-neutral-200 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">AI Suggestion</p>
                  <p className="text-xs text-neutral-500">Add modifier 59</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 p-4 bg-white rounded-xl shadow-lg border border-neutral-200 animate-float-delayed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">$9,450</p>
                  <p className="text-xs text-neutral-500">Est. Reimbursement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// PROBLEM SECTION
// ============================================================================

function ProblemSection() {
  const problems = [
    {
      icon: XCircle,
      stat: '$262B',
      label: 'Lost annually to claim denials',
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      icon: AlertTriangle,
      stat: '20%',
      label: 'Average denial rate in healthcare',
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      icon: Clock,
      stat: '45 days',
      label: 'Average time to resolve a denial',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  ]

  return (
    <section className="py-20 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            Claim denials are costing you more than you think
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
            Every denied claim means lost revenue, wasted staff time, and delayed patient care.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-2xl bg-neutral-800 border border-neutral-700"
            >
              <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', problem.bg)}>
                <problem.icon className={cn('h-7 w-7', problem.color)} />
              </div>
              <p className="mt-6 text-4xl font-bold text-white">{problem.stat}</p>
              <p className="mt-2 text-neutral-400">{problem.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-neutral-300">
            <span className="text-amber-400 font-semibold">The good news?</span>{' '}
            90% of denials are preventable with the right tools.
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// SOLUTION / FEATURES SECTION
// ============================================================================

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Validation',
      description: 'Our AI analyzes CPT-ICD relationships, NCCI edits, and payer rules to catch errors before submission.',
      color: 'bg-purple-500',
    },
    {
      icon: Shield,
      title: 'Denial Prevention',
      description: 'Identify CO-11, CO-15, CO-16, and other common denial codes before they happen.',
      color: 'bg-amber-500',
    },
    {
      icon: Zap,
      title: 'Real-Time Results',
      description: 'Get validation results in under 2 seconds. No waiting, no batch processing.',
      color: 'bg-blue-500',
    },
    {
      icon: FileText,
      title: 'CMS Coverage Checks',
      description: 'Automatic NCD/LCD lookup to ensure procedures are covered by payer policies.',
      color: 'bg-green-500',
    },
    {
      icon: Users,
      title: 'Epic EHR Integration',
      description: 'Launch directly from Epic, pull patient data, and streamline your workflow.',
      color: 'bg-indigo-500',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track denial trends, identify problem areas, and measure your improvement.',
      color: 'bg-rose-500',
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            Features
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900">
            Everything you need to submit clean claims
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Comprehensive validation for oncology, mental health, OB/GYN, and endocrinology practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300"
            >
              <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', feature.color)}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900 group-hover:text-amber-700 transition-colors">
                {feature.title}
              </h3>
              <p className="mt-3 text-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// HOW IT WORKS
// ============================================================================

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Enter claim details',
      description: 'Input patient, procedure, and diagnosis information — or pull directly from your EHR.',
    },
    {
      number: '02',
      title: 'AI validates instantly',
      description: 'Our AI checks CPT-ICD match, NCCI edits, NPI, prior auth, and 15+ other validation rules.',
    },
    {
      number: '03',
      title: 'Fix issues with suggestions',
      description: 'Get actionable suggestions to fix any problems. One click to apply recommended fixes.',
    },
    {
      number: '04',
      title: 'Submit with confidence',
      description: 'Submit clean claims to your clearinghouse knowing they\'ll be accepted first-time.',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            How It Works
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900">
            Clean claims in four simple steps
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-amber-300 to-amber-100 -z-10" />
              )}

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-heading text-2xl font-bold shadow-lg shadow-amber-600/25">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-neutral-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// PRICING SECTION
// ============================================================================

function PricingSection() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: 'Free Trial',
      price: 0,
      period: 'for 3 days',
      description: 'Try Denali Health risk-free',
      features: [
        { text: '1 claim per day', included: true },
        { text: 'All 4 specialties', included: true },
        { text: 'Basic validation', included: true },
        { text: 'Email support', included: true },
        { text: 'Chat assistant', included: false },
        { text: 'API access', included: false },
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Pay Per Claim',
      price: 10,
      period: 'per claim',
      description: 'Pay only for what you use',
      features: [
        { text: 'Unlimited claims', included: true },
        { text: 'All 4 specialties', included: true },
        { text: 'Full validation suite', included: true },
        { text: 'Email support', included: true },
        { text: 'Chat assistant', included: true },
        { text: 'API access', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Unlimited',
      price: annual ? 70 : 100,
      period: 'per month',
      description: annual ? 'Billed annually ($840/year)' : 'Best value for high volume',
      features: [
        { text: 'Unlimited claims', included: true },
        { text: 'All 4 specialties', included: true },
        { text: 'Full validation suite', included: true },
        { text: 'Priority support', included: true },
        { text: 'Chat assistant', included: true },
        { text: 'API access', included: true },
        { text: 'Analytics dashboard', included: true },
        { text: 'Epic EHR integration', included: true },
      ],
      cta: 'Subscribe Now',
      popular: true,
    },
  ]

  return (
    <section id="pricing" className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            Pricing
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Reduce denials. Recover revenue. No surprises.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 bg-neutral-200 rounded-full">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                !annual ? 'bg-white text-neutral-900 shadow' : 'text-neutral-600'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                annual ? 'bg-white text-neutral-900 shadow' : 'text-neutral-600'
              )}
            >
              Annual
              <span className="ml-1.5 text-xs text-green-600 font-semibold">Save 30%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={cn(
                'relative p-8 rounded-2xl bg-white border-2 transition-all',
                plan.popular
                  ? 'border-amber-400 shadow-xl scale-105'
                  : 'border-neutral-200 hover:border-amber-200 hover:shadow-lg'
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-600 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="font-heading text-xl font-semibold text-neutral-900">
                {plan.name}
              </h3>

              <div className="mt-4">
                <span className="font-heading text-5xl font-bold text-neutral-900">
                  ${plan.price}
                </span>
                <span className="text-neutral-500 ml-2">{plan.period}</span>
              </div>

              <p className="mt-2 text-sm text-neutral-500">{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Minus className="h-5 w-5 text-neutral-300 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-neutral-700' : 'text-neutral-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={cn(
                  'mt-8 block w-full py-3 px-6 text-center font-semibold rounded-xl transition-all',
                  plan.popular
                    ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-600/25'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-12 text-center">
          <p className="text-neutral-600">
            Need a custom plan for your health system?{' '}
            <a href="mailto:sales@claimscrub.com" className="text-amber-600 font-semibold hover:underline">
              Contact Sales
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Denali Health reduced our denial rate from 18% to under 3%. The ROI was immediate.",
      author: 'Dr. Sarah Chen',
      role: 'Medical Director',
      company: 'Memorial Oncology Associates',
      avatar: 'SC',
      rating: 5,
    },
    {
      quote: "Finally, a tool that understands the complexity of mental health billing. The CPT-ICD suggestions are spot-on.",
      author: 'Michael Torres',
      role: 'Practice Manager',
      company: 'Serenity Behavioral Health',
      avatar: 'MT',
      rating: 5,
    },
    {
      quote: "We process 500+ claims weekly. Denali Health catches errors our staff misses every single day.",
      author: 'Jennifer Walsh',
      role: 'Revenue Cycle Director',
      company: 'Women\'s Health Partners',
      avatar: 'JW',
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            Testimonials
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900">
            Trusted by healthcare practices nationwide
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>

              <blockquote className="mt-6 text-lg text-neutral-700 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{testimonial.author}</p>
                  <p className="text-sm text-neutral-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos */}
        <div className="mt-16 pt-16 border-t border-neutral-200">
          <p className="text-center text-sm text-neutral-500 mb-8">
            Trusted by 500+ healthcare practices
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {['Memorial Health', 'City Medical', 'Bay Area Oncology', 'Central Psychiatry', 'Women\'s Health'].map((name, idx) => (
              <div key={idx} className="text-xl font-heading font-bold text-neutral-400">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// FAQ SECTION
// ============================================================================

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: 'How does Denali Health prevent denials?',
      a: 'Denali Health validates claims against 15+ rules including CPT-ICD medical necessity matching, NCCI edits, NPI verification, prior authorization requirements, and payer-specific policies. We catch errors before you submit, preventing common denial codes like CO-11, CO-15, and CO-16.',
    },
    {
      q: 'What specialties do you support?',
      a: 'We currently support Oncology, Mental Health, OB/GYN, and Endocrinology with specialty-specific validation rules. Each specialty has custom CPT-ICD mappings, modifier requirements, and documentation checks tailored to their billing complexity.',
    },
    {
      q: 'Is Denali Health HIPAA compliant?',
      a: 'Yes, absolutely. We use enterprise-grade encryption, maintain BAA agreements, implement comprehensive audit logging, and host on HIPAA-compliant infrastructure. We never store PHI longer than necessary for processing.',
    },
    {
      q: 'Can I integrate with my EHR?',
      a: 'Yes! Our Unlimited plan includes Epic EHR integration via App Orchard. You can launch Denali Health directly from within Epic and pull patient data automatically. We\'re adding more EHR integrations soon.',
    },
    {
      q: 'What\'s the free trial like?',
      a: 'Our 3-day free trial gives you full access to validate 1 claim per day across all specialties. No credit card required. You can test drive the validation engine, see AI suggestions, and experience the full workflow.',
    },
    {
      q: 'How quickly will I see ROI?',
      a: 'Most practices see positive ROI within the first month. With an average claim value of $500+ and denial prevention of 94%, even a handful of saved denials covers the subscription cost. Many customers report $10K+ monthly savings.',
    },
  ]

  return (
    <section id="faq" className="py-20 bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-neutral-900 pr-4">{faq.q}</span>
                {openIdx === idx ? (
                  <ChevronUp className="h-5 w-5 text-neutral-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-neutral-500 flex-shrink-0" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6">
                  <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// CTA SECTION
// ============================================================================

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-600 to-amber-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
          Ready to stop losing revenue to denials?
        </h2>
        <p className="mt-4 text-xl text-amber-100">
          Join 500+ practices already saving thousands monthly with Denali Health.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-all shadow-lg"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="mailto:sales@claimscrub.com"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all"
          >
            Talk to Sales
          </a>
        </div>
        <p className="mt-6 text-amber-200 text-sm">
          No credit card required · HIPAA compliant · Cancel anytime
        </p>
      </div>
    </section>
  )
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-white">
                Denali Health
              </span>
            </div>
            <p className="mt-4 text-sm">
              Denials Prevention, Not Denials Management. AI-powered validation for healthcare practices.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="mailto:hello@claimscrub.com" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">BAA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Denali Health. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs font-medium rounded">
              HIPAA Compliant
            </span>
            <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs font-medium rounded">
              SOC 2 Type II
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================================================
// MAIN LANDING PAGE
// ============================================================================

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Custom animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>

      <Navigation />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
