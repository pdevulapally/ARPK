"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("terms")

  const lastUpdated = "15 April 2024"

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Legal Documents</h1>
          <p className="text-gray-400">Please review our legal documents carefully. Last updated: {lastUpdated}</p>
        </div>

        <Tabs defaultValue="terms" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-gray-900 border-gray-800 w-full justify-start">
            <TabsTrigger
              value="terms"
              className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
            >
              Terms & Conditions
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
            >
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger
              value="cookies"
              className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
            >
              Cookie Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-6">Terms and Conditions</h2>

              <p className="text-gray-300 mb-4">
                Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the
                website operated by ARPK Web Development ("us", "we", "our").
              </p>

              <p className="text-gray-300 mb-4">
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these
                Terms. These Terms apply to all visitors, users, and others who access or use the Service.
              </p>

              <p className="text-gray-300 mb-6">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part
                of the terms, then you may not access the Service.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Services</h3>

              <p className="text-gray-300 mb-4">
                ARPK Web Development provides web development, design, and related digital services ("Services") to
                clients. The specific details, deliverables, timelines, and payment terms for each project will be
                outlined in a separate agreement or statement of work between ARPK Web Development and the client.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Intellectual Property Rights</h3>

              <p className="text-gray-300 mb-4">
                2.1 <strong>Our Intellectual Property</strong>: The Service and its original content (excluding content
                provided by users), features, and functionality are and will remain the exclusive property of ARPK Web
                Development and its licensors. The Service is protected by copyright, trademark, and other laws of both
                the United Kingdom and foreign countries. Our trademarks and trade dress may not be used in connection
                with any product or service without the prior written consent of ARPK Web Development.
              </p>

              <p className="text-gray-300 mb-4">
                2.2 <strong>Client Content</strong>: Clients retain ownership of all intellectual property rights in and
                to the content they provide to us for use in the development of their website or digital products. By
                providing content to us, clients grant us a worldwide, non-exclusive, royalty-free license to use,
                reproduce, modify, and display the content solely for the purpose of providing the Services.
              </p>

              <p className="text-gray-300 mb-4">
                2.3 <strong>Deliverables</strong>: Upon full payment of all applicable fees, we grant the client a
                worldwide, non-exclusive, non-transferable, non-sublicensable license to use the deliverables for their
                intended purpose. We retain ownership of all pre-existing materials, development tools, know-how,
                methodologies, processes, technologies, or algorithms used to create the deliverables.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. Payment Terms</h3>

              <p className="text-gray-300 mb-4">
                3.1 <strong>Fees</strong>: Clients agree to pay all fees specified in the project agreement. All fees
                are quoted in British Pounds (GBP) unless otherwise specified.
              </p>

              <p className="text-gray-300 mb-4">
                3.2 <strong>Payment Schedule</strong>: Unless otherwise specified in the project agreement, payment
                terms are as follows:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">50% of the total project fee is due before work begins</li>
                <li className="mb-2">
                  The remaining 50% is due upon project completion and before the final deliverables are provided
                </li>
              </ul>

              <p className="text-gray-300 mb-4">
                3.3 <strong>Late Payments</strong>: Late payments may be subject to a late fee of 2% per month on any
                outstanding balance, or the maximum permitted by law, whichever is lower, plus all expenses of
                collection.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Project Timeline and Delivery</h3>

              <p className="text-gray-300 mb-4">
                4.1 <strong>Timeline</strong>: Project timelines will be outlined in the project agreement. We will make
                reasonable efforts to meet agreed-upon deadlines.
              </p>

              <p className="text-gray-300 mb-4">
                4.2 <strong>Client Delays</strong>: Delays caused by the client, including but not limited to delays in
                providing necessary content, feedback, or approvals, may result in project delays and potential
                additional costs.
              </p>

              <p className="text-gray-300 mb-4">
                4.3 <strong>Revisions</strong>: The number of revisions included in the project scope will be specified
                in the project agreement. Additional revisions may incur additional fees.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">5. Client Responsibilities</h3>

              <p className="text-gray-300 mb-4">Clients are responsible for:</p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">Providing accurate and timely information, content, and feedback</li>
                <li className="mb-2">Reviewing and approving deliverables within the agreed timeframe</li>
                <li className="mb-2">Ensuring they have the necessary rights to use any content provided to us</li>
                <li className="mb-2">
                  Complying with all applicable laws and regulations regarding their website content and operations
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">6. Limitation of Liability</h3>

              <p className="text-gray-300 mb-4">
                6.1 In no event shall ARPK Web Development, nor its directors, employees, partners, agents, suppliers,
                or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">Your use of or inability to use the Service</li>
                <li className="mb-2">
                  Any unauthorized access to or use of our servers and/or any personal information stored therein
                </li>
                <li className="mb-2">Any interruption or cessation of transmission to or from the Service</li>
                <li className="mb-2">
                  Any bugs, viruses, trojan horses, or the like, which may be transmitted to or through the Service by
                  any third party
                </li>
              </ul>

              <p className="text-gray-300 mb-4">
                6.2 Our total liability to you for all claims arising from or related to the Services will not exceed
                the amount paid by you to us for the Services giving rise to the claim.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">7. Indemnification</h3>

              <p className="text-gray-300 mb-4">
                You agree to defend, indemnify, and hold harmless ARPK Web Development and its licensee and licensors,
                and their employees, contractors, agents, officers, and directors, from and against any and all claims,
                damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to
                attorney's fees) arising from:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">Your use of and access to the Service</li>
                <li className="mb-2">Your violation of any term of these Terms</li>
                <li className="mb-2">
                  Your violation of any third-party right, including without limitation any copyright, property, or
                  privacy right
                </li>
                <li className="mb-2">Any claim that your content caused damage to a third party</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">8. Termination</h3>

              <p className="text-gray-300 mb-4">
                8.1 <strong>Termination by Us</strong>: We may terminate or suspend your access to our Service
                immediately, without prior notice or liability, for any reason whatsoever, including without limitation
                if you breach the Terms.
              </p>

              <p className="text-gray-300 mb-4">
                8.2 <strong>Termination by Client</strong>: Clients may terminate a project by providing written notice.
                In the event of termination, clients are responsible for paying for all work completed up to the date of
                termination, plus any non-cancellable expenses incurred.
              </p>

              <p className="text-gray-300 mb-4">
                8.3 <strong>Effect of Termination</strong>: Upon termination, your right to use the Service will
                immediately cease. If you wish to terminate your account or project, you may simply discontinue using
                the Service or notify us.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">9. Governing Law</h3>

              <p className="text-gray-300 mb-4">
                These Terms shall be governed and construed in accordance with the laws of the United Kingdom, without
                regard to its conflict of law provisions.
              </p>

              <p className="text-gray-300 mb-4">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
                provisions of these Terms will remain in effect.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">10. Changes to Terms</h3>

              <p className="text-gray-300 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will try to provide at least 30 days' notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              <p className="text-gray-300 mb-4">
                By continuing to access or use our Service after those revisions become effective, you agree to be bound
                by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">11. Contact Us</h3>

              <p className="text-gray-300 mb-4">If you have any questions about these Terms, please contact us at:</p>

              <p className="text-gray-300 mb-4">
                Email: legal@arpk.dev
                <br />
                Address: 123 Web Street, London, UK
              </p>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-6">Privacy Policy</h2>

              <p className="text-gray-300 mb-4">
                ARPK Web Development ("we", "our", "us") is committed to protecting and respecting your privacy. This
                Privacy Policy explains how we collect, use, and safeguard your information when you visit our website
                or use our services.
              </p>

              <p className="text-gray-300 mb-6">
                We are committed to complying with applicable data protection laws, including the UK Data Protection Act
                2018, the UK GDPR, and where applicable, the EU General Data Protection Regulation (GDPR).
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h3>

              <p className="text-gray-300 mb-4">We may collect the following types of information:</p>

              <h4 className="text-lg font-medium text-white mt-6 mb-3">1.1 Personal Information</h4>

              <p className="text-gray-300 mb-4">
                Personal information is data that can be used to identify you directly or indirectly. We may collect:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">Identity Data: Name, username, or similar identifier</li>
                <li className="mb-2">Contact Data: Email address, telephone number, postal address</li>
                <li className="mb-2">
                  Financial Data: Payment details (processed securely through our payment processors)
                </li>
                <li className="mb-2">Profile Data: Your preferences, feedback, and survey responses</li>
                <li className="mb-2">Usage Data: Information about how you use our website and services</li>
                <li className="mb-2">Marketing Data: Your preferences in receiving marketing from us</li>
              </ul>

              <h4 className="text-lg font-medium text-white mt-6 mb-3">1.2 Technical Data</h4>

              <p className="text-gray-300 mb-4">When you visit our website, we may automatically collect:</p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">IP address</li>
                <li className="mb-2">Browser type and version</li>
                <li className="mb-2">Operating system</li>
                <li className="mb-2">Time zone setting and location</li>
                <li className="mb-2">Pages visited and how you navigate the website</li>
                <li className="mb-2">Device information</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. How We Collect Your Information</h3>

              <p className="text-gray-300 mb-4">We collect information through:</p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">
                  Direct interactions: When you contact us, request information, or use our services
                </li>
                <li className="mb-2">Automated technologies: Cookies, server logs, and similar technologies</li>
                <li className="mb-2">
                  Third parties: Analytics providers, advertising networks, and search information providers
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. How We Use Your Information</h3>

              <p className="text-gray-300 mb-4">
                We will only use your personal information when the law allows us to. Most commonly, we will use your
                personal information in the following circumstances:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">To provide and maintain our services</li>
                <li className="mb-2">To process and complete transactions</li>
                <li className="mb-2">
                  To send administrative information, such as updates, security alerts, and support messages
                </li>
                <li className="mb-2">To respond to your comments, questions, and requests</li>
                <li className="mb-2">To improve our website and services</li>
                <li className="mb-2">To send marketing communications (with your consent)</li>
                <li className="mb-2">To comply with legal obligations</li>
                <li className="mb-2">To protect our rights, property, or safety, or that of our users or others</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Legal Basis for Processing</h3>

              <p className="text-gray-300 mb-4">
                Under data protection laws, we must have a legal basis for processing your personal information. The
                legal bases we rely on include:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">
                  <strong>Consent</strong>: Where you have given clear consent for us to process your personal
                  information for a specific purpose
                </li>
                <li className="mb-2">
                  <strong>Contract</strong>: Where processing is necessary for the performance of a contract with you or
                  to take steps at your request before entering into a contract
                </li>
                <li className="mb-2">
                  <strong>Legal obligation</strong>: Where processing is necessary for compliance with a legal
                  obligation
                </li>
                <li className="mb-2">
                  <strong>Legitimate interests</strong>: Where processing is necessary for our legitimate interests or
                  those of a third party, provided your interests and fundamental rights do not override those interests
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">5. Data Sharing and Transfers</h3>

              <p className="text-gray-300 mb-4">We may share your personal information with:</p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">Service providers who perform services on our behalf</li>
                <li className="mb-2">Professional advisers including lawyers, bankers, auditors, and insurers</li>
                <li className="mb-2">
                  Regulatory authorities, law enforcement agencies, and other authorities when required by law
                </li>
              </ul>

              <p className="text-gray-300 mb-4">
                Some of our external third parties may be based outside the UK or European Economic Area (EEA), which
                may involve a transfer of your data outside these areas. Whenever we transfer your personal information
                outside the UK or EEA, we ensure a similar degree of protection by ensuring at least one of the
                following safeguards is implemented:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">
                  Transferring to countries that have been deemed to provide an adequate level of protection
                </li>
                <li className="mb-2">
                  Using specific contracts approved by the UK Information Commissioner or European Commission
                </li>
                <li className="mb-2">
                  Using providers based in the US that are part of approved frameworks ensuring the protection of
                  personal data
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">6. Data Security</h3>

              <p className="text-gray-300 mb-4">
                We have implemented appropriate security measures to prevent your personal information from being
                accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to
                your personal information to those employees, agents, contractors, and other third parties who have a
                business need to know.
              </p>

              <p className="text-gray-300 mb-4">
                We have procedures in place to deal with any suspected personal data breach and will notify you and any
                applicable regulator of a breach where we are legally required to do so.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">7. Data Retention</h3>

              <p className="text-gray-300 mb-4">
                We will only retain your personal information for as long as necessary to fulfill the purposes we
                collected it for, including for the purposes of satisfying any legal, accounting, or reporting
                requirements.
              </p>

              <p className="text-gray-300 mb-4">
                To determine the appropriate retention period for personal information, we consider the amount, nature,
                and sensitivity of the personal information, the potential risk of harm from unauthorized use or
                disclosure, the purposes for which we process it, and whether we can achieve those purposes through
                other means, and the applicable legal requirements.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">8. Your Legal Rights</h3>

              <p className="text-gray-300 mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal
                information, including the right to:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">
                  <strong>Request access</strong> to your personal information
                </li>
                <li className="mb-2">
                  <strong>Request correction</strong> of your personal information
                </li>
                <li className="mb-2">
                  <strong>Request erasure</strong> of your personal information
                </li>
                <li className="mb-2">
                  <strong>Object to processing</strong> of your personal information
                </li>
                <li className="mb-2">
                  <strong>Request restriction</strong> of processing your personal information
                </li>
                <li className="mb-2">
                  <strong>Request transfer</strong> of your personal information
                </li>
                <li className="mb-2">
                  <strong>Right to withdraw consent</strong> where we rely on consent to process your personal
                  information
                </li>
              </ul>

              <p className="text-gray-300 mb-4">
                You will not have to pay a fee to access your personal information or to exercise any of the other
                rights. However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or
                excessive. Alternatively, we may refuse to comply with your request in these circumstances.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">9. Children's Privacy</h3>

              <p className="text-gray-300 mb-4">
                Our Service is not intended for children under the age of 16. We do not knowingly collect personal
                information from children under 16. If you are a parent or guardian and you are aware that your child
                has provided us with personal information, please contact us so that we can take necessary actions.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">10. Changes to This Privacy Policy</h3>

              <p className="text-gray-300 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "last updated" date.
              </p>

              <p className="text-gray-300 mb-4">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                Policy are effective when they are posted on this page.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">11. Contact Us</h3>

              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>

              <p className="text-gray-300 mb-4">
                Email: privacy@arpk.dev
                <br />
                Address: 123 Web Street, London, UK
              </p>

              <p className="text-gray-300 mb-4">
                You have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the
                UK supervisory authority for data protection issues (www.ico.org.uk). However, we would appreciate the
                chance to deal with your concerns before you approach the ICO, so please contact us in the first
                instance.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="cookies" className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-6">Cookie Policy</h2>

              <p className="text-gray-300 mb-4">
                This Cookie Policy explains how ARPK Web Development ("we", "our", "us") uses cookies and similar
                technologies on our website. This policy should be read alongside our Privacy Policy, which explains how
                we use personal information.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. What Are Cookies?</h3>

              <p className="text-gray-300 mb-4">
                Cookies are small text files that are placed on your device when you visit a website. They are widely
                used to make websites work more efficiently and provide information to the website owners.
              </p>

              <p className="text-gray-300 mb-4">
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go
                offline, while session cookies are deleted as soon as you close your web browser.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. How We Use Cookies</h3>

              <p className="text-gray-300 mb-4">We use cookies for several reasons:</p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">
                  <strong>Essential cookies</strong>: These are necessary for the website to function properly and
                  cannot be switched off in our systems.
                </li>
                <li className="mb-2">
                  <strong>Performance cookies</strong>: These allow us to count visits and traffic sources so we can
                  measure and improve the performance of our site.
                </li>
                <li className="mb-2">
                  <strong>Functionality cookies</strong>: These enable the website to provide enhanced functionality and
                  personalization.
                </li>
                <li className="mb-2">
                  <strong>Targeting cookies</strong>: These may be set through our site by our advertising partners to
                  build a profile of your interests.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. Types of Cookies We Use</h3>

              <h4 className="text-lg font-medium text-white mt-6 mb-3">3.1 Essential Cookies</h4>

              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-700 p-2 text-left">Cookie Name</th>
                    <th className="border border-gray-700 p-2 text-left">Purpose</th>
                    <th className="border border-gray-700 p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">XSRF-TOKEN</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Security - Helps protect against cross-site request forgery attacks
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">session</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Authentication - Maintains your login session
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">2 hours</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">sidebar:state</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Functionality - Remembers sidebar state
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">7 days</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="text-lg font-medium text-white mt-6 mb-3">3.2 Performance Cookies</h4>

              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-700 p-2 text-left">Cookie Name</th>
                    <th className="border border-gray-700 p-2 text-left">Purpose</th>
                    <th className="border border-gray-700 p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">_ga</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Analytics - Used by Google Analytics to distinguish users
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">2 years</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">_gid</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Analytics - Used by Google Analytics to distinguish users
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">24 hours</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">_gat</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Analytics - Used by Google Analytics to throttle request rate
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">1 minute</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="text-lg font-medium text-white mt-6 mb-3">3.3 Functionality Cookies</h4>

              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-700 p-2 text-left">Cookie Name</th>
                    <th className="border border-gray-700 p-2 text-left">Purpose</th>
                    <th className="border border-gray-700 p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">theme</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Functionality - Remembers your preferred theme (light/dark)
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">language</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Functionality - Remembers your preferred language
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">1 year</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="text-lg font-medium text-white mt-6 mb-3">3.4 Targeting Cookies</h4>

              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="border border-gray-700 p-2 text-left">Cookie Name</th>
                    <th className="border border-gray-700 p-2 text-left">Purpose</th>
                    <th className="border border-gray-700 p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">_fbp</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Marketing - Used by Facebook to deliver advertisements
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">3 months</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 p-2 text-gray-300">_gcl_au</td>
                    <td className="border border-gray-700 p-2 text-gray-300">
                      Marketing - Used by Google AdSense for experimenting with advertisement efficiency
                    </td>
                    <td className="border border-gray-700 p-2 text-gray-300">3 months</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">4. Third-Party Cookies</h3>

              <p className="text-gray-300 mb-4">
                Some cookies are placed by third parties on our website. These third parties may include analytics
                providers (like Google), advertising networks, and social media platforms. These third-party cookies are
                governed by the respective third party's privacy policy.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">5. Managing Cookies</h3>

              <p className="text-gray-300 mb-4">
                Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse
                cookies, or to alert you when cookies are being sent. The methods for doing so vary from browser to
                browser, and from version to version.
              </p>

              <p className="text-gray-300 mb-4">
                You can generally find how to manage cookies in the "Settings", "Preferences" or "Tools" menu of your
                browser. You may also consult the browser's "Help" menu. Different browsers may use different names for
                cookie-related functions.
              </p>

              <p className="text-gray-300 mb-4">
                Please note that blocking or deleting cookies may impact your experience on our website, as some
                features may not function properly.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">6. Cookie Consent</h3>

              <p className="text-gray-300 mb-4">
                When you first visit our website, we will ask for your consent to set cookies on your device, except for
                essential cookies which are necessary for the website to function properly.
              </p>

              <p className="text-gray-300 mb-4">
                You can change your cookie preferences at any time by clicking on the "Cookie Settings" link in the
                footer of our website.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">7. Similar Technologies</h3>

              <p className="text-gray-300 mb-4">
                In addition to cookies, we may use other similar technologies on our website:
              </p>

              <ul className="list-disc pl-6 mb-4 text-gray-300">
                <li className="mb-2">
                  <strong>Web beacons</strong>: Small graphic images (also known as "pixel tags" or "clear GIFs") that
                  may be included on our sites and services that typically work in conjunction with cookies to identify
                  our users and user behavior.
                </li>
                <li className="mb-2">
                  <strong>Local storage</strong>: We may use local storage technologies (such as HTML5 localStorage) to
                  store content information and preferences.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">8. Changes to This Cookie Policy</h3>

              <p className="text-gray-300 mb-4">
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new
                Cookie Policy on this page and updating the "last updated" date.
              </p>

              <p className="text-gray-300 mb-4">
                You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy
                are effective when they are posted on this page.
              </p>

              <h3 className="text-xl font-semibold text-white mt-8 mb-4">9. Contact Us</h3>

              <p className="text-gray-300 mb-4">
                If you have any questions about our Cookie Policy, please contact us at:
              </p>

              <p className="text-gray-300 mb-4">
                Email: privacy@arpk.dev
                <br />
                Address: 123 Web Street, London, UK
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => {
              const prevTab = activeTab === "terms" ? "cookies" : activeTab === "privacy" ? "terms" : "privacy"
              setActiveTab(prevTab)
            }}
            className="text-purple-400 border-purple-800 hover:bg-purple-900/20"
          >
            Previous Document
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const nextTab = activeTab === "terms" ? "privacy" : activeTab === "privacy" ? "cookies" : "terms"
              setActiveTab(nextTab)
            }}
            className="text-purple-400 border-purple-800 hover:bg-purple-900/20"
          >
            Next Document
          </Button>
        </div>
      </div>
    </div>
  )
}
