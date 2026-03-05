import { useState, useRef, useEffect } from "react";
/* ─────────────────────────────────────────────
   ICO Accountability Assessment — Comprehensive (77 questions)
   Notion-style: Source Serif 4 headings, system fonts body,
   #37352f primary, #e8e5e0 borders, 680px max-width
   ───────────────────────────────────────────── */

// ── Section metadata (ICO's 10 categories) ──
const SECTIONS = [
  { id: "leadership", label: "Leadership & Oversight", icon: "§1", count: 6 },
  { id: "policies", label: "Policies & Procedures", icon: "§2", count: 4 },
  { id: "training", label: "Training & Awareness", icon: "§3", count: 5 },
  { id: "rights", label: "Individuals' Rights", icon: "§4", count: 12 },
  { id: "transparency", label: "Transparency", icon: "§5", count: 7 },
  { id: "records", label: "Records of Processing & Lawful Basis", icon: "§6", count: 10 },
  { id: "contracts", label: "Contracts & Data Sharing", icon: "§7", count: 9 },
  { id: "risks", label: "Risks & DPIAs", icon: "§8", count: 5 },
  { id: "security", label: "Records Management & Security", icon: "§9", count: 13 },
  { id: "breach", label: "Breach Response & Monitoring", icon: "§10", count: 8 },
];

// ── Answer options ──
const OPTIONS = [
  { value: "yes", label: "Yes, fully in place", score: 3, color: "#22c55e" },
  { value: "partial", label: "Partially in place", score: 2, color: "#f59e0b" },
  { value: "no", label: "No / not started", score: 1, color: "#ef4444" },
  { value: "na", label: "Not applicable", score: null, color: "#9b9a97" },
];

// ── Minimum completion threshold (80%) for results & email ──
const COMPLETION_THRESHOLD = 0.8;

// ── Questions (77 questions across 10 sections) ──
const QUESTIONS = {
  leadership: [
    {
      id: "ico-1-1",
      question: "There is an organisational structure for managing data protection and information governance, which provides strong leadership and oversight, clear reporting lines and responsibilities, and effective information flows.",
      help: "Assign overall responsibility for data protection and information governance to the board, or highest senior management level.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 1.1",
      severity: "critical",
      effort: "quick",
    },
    {
      id: "ico-1-2",
      question: "If it is necessary to appoint a DPO under Article 37 of the UK GDPR, the DPO's role is adequately supported and covers all the requirements and responsibilities.",
      help: "Ensure the DPO has specific responsibilities in line with Article 39 of the UK GDPR for data protection compliance, data protection policies, awareness raising, training and audits.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 1.2",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-1-3",
      question: "The DPO is independent and unbiased. They report to the highest management level and staff are clear about how to contact them.",
      help: "Educate staff so they who the DPO is, what their role is and how to contact them.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 1.3",
      severity: "high",
      effort: "quick",
    },
    {
      id: "ico-1-4",
      question: "There are operational roles in place to support the practical implementation of data protection and information governance.",
      help: "Ensure data protection and information governance staff have clear responsibilities to support your organisations data protection compliance.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 1.4",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-1-5",
      question: "There is an oversight group which provides direction and guidance across your organisation for data protection and information governance activities.",
      help: "Ensure key staff, eg the DPO, regularly attend the oversight group meetings.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 1.5",
      severity: "medium",
      effort: "moderate",
    },
    {
      id: "ico-1-6",
      question: "There are operational level groups that meet to discuss and coordinate data protection and information governance activities.",
      help: "Ensure the groups meet regularly and are attended by relevant staff.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 1.6",
      severity: "medium",
      effort: "moderate",
    },
  ],
  policies: [
    {
      id: "ico-2-1",
      question: "Policies and procedures provide staff with enough direction to understand their data protection and information governance roles and responsibilities.",
      help: "Ensure the policy framework stems from strategic business planning for data protection and information governance, which the highest level of management endorses. | Implement policies that cover data protection, records management and information security. | Make operational procedures, guidance and manuals readily available to support data protection policies and provide direction to operational staff. | Ensure policies and procedures clearly outline roles and responsibilities.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 2.1",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-2-2",
      question: "There is a review and approval process in place to make sure that policies and procedures are consistent and effective.",
      help: "Ensure all policies and procedures follow an agreed format and style. | Ensure an appropriately senior staff member reviews and approves all new and existing policies and procedures. | Review existing policies and procedures in line with documented review dates, so they are up-to-date and fit for purpose. | Update policies and procedures without undue delay when they require changes, eg because of operational change, court or regulatory decisions or changes in regulatory guidance. | Show document control information, including version number, owner, review date and change history in all policies, procedures and guidelines.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 2.2",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-2-3",
      question: "Staff are fully aware of the data protection and information governance policies and procedures that are relevant to their role.",
      help: "Ensure staff read and understand the policies and procedures, including why they are important to implement and comply with. | Tell staff about updated policies and procedures. | Make policies and procedures readily available for all staff on your organisation's intranet site (or equivalent shared area) or provide them in other formats. | Use guidelines, posters or publications to help to emphasise key messages and raise staff awareness of policies and procedures.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 2.3",
      severity: "medium",
      effort: "quick",
    },
    {
      id: "ico-2-4",
      question: "Policies and procedures foster a 'data protection by design and by default' approach across the organisation.",
      help: "Where relevant, consider policies and procedures across your organisation with data protection in mind. | Implement policies and procedures to ensure data protection issues are considered when systems, services, products and business practices involving personal information are designed and implemented, and that personal information is protected by default. | Set out your organisation's approach to implementing the data protection principles and safeguarding people's rights, such as data minimisation, pseudonymisation and purpose limitation, in policies and procedures. | Give the personal information of vulnerable groups, eg children, extra protection in policies and procedures.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 2.4",
      severity: "high",
      effort: "moderate",
    },
  ],
  training: [
    {
      id: "ico-3-1",
      question: "There is an all-staff data protection and information governance training programme.",
      help: "Incorporate national and sector-specific requirements in the training programme. | Ensure the programme is comprehensive and includes training for all staff on key areas of data protection such as handling requests, data sharing, information security, personal data breaches and records management. | Consider the training needs of all staff and use this information to compile the training programme. | Assign responsibilities for managing information governance and data protection training across your organisation and have training plans or strategies in place to meet training needs within agreed time-scales. | Have dedicated and trained resources available to deliver training to all staff. | Regularly review the programme to ensure that it remains accurate and up to date. | Require senior management to sign off the programme.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 3.1",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-3-2",
      question: "The training programme includes induction and refresher training for all staff on data protection and information governance.",
      help: "Ensure appropriate staff, such as the DPO or an information governance manager, oversee or approve induction training. | Deliver induction and refresher training to all staff, regardless of how long they will be working for your organisation, their contractual status or grade. | Deliver induction training to all staff prior to accessing personal information and within one month of their start date. | Ensure staff complete refresher training at appropriate intervals.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 3.2",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-3-3",
      question: "Specialised roles or functions with key data protection responsibilities (such as DPOs, subject access and records management teams) receive additional training and professional development beyond the basic level provided to all staff.",
      help: "Complete a training needs analysis for information governance and data protection staff to inform the training plan and to ensure it is specific to their responsibilities. | Detail training and skills requirements in job descriptions. | Have evidence to confirm that key roles complete up-to-date and appropriate specialised training and professional development, and are subject to proportionate refresher training. | Keep on record copies of the training material provided as well as details of who received the training.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 3.3",
      severity: "medium",
      effort: "moderate",
    },
    {
      id: "ico-3-4",
      question: "There is evidence to demonstrate that staff complete and understand the training and this is monitored appropriately through assessments or surveys.",
      help: "Conduct an assessment at the end of the training to test staff understanding and make sure that it is effective, which could include a minimum pass mark. | Keep copies of the training material provided on record as well as details of who receives the training. | Monitor training completion in line with organisational requirements at all levels of the organisation, and follow up with staff who do not complete the training. | Enable staff to provide feedback on the training they receive.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 3.4",
      severity: "medium",
      effort: "moderate",
    },
    {
      id: "ico-3-5",
      question: "Awareness is raised across the organisation of data protection, information governance and associated policies and procedures in meetings or staff forums. It is easy for staff to access relevant material.",
      help: "Use a variety of appropriate methods to raise staff awareness and the profile of data protection and information governance, for example by emails, team briefings and meetings, posters, handouts and blogs. | Make it easy for staff to access relevant material, and find out who to contact if they have any queries relating to data protection and information governance.",
      weight: 1,
      icoRef: "ICO Accountability Framework: Expectation 3.5",
      severity: "low",
      effort: "quick",
    },
  ],
  rights: [
    {
      id: "ico-4-1",
      question: "People are informed about their rights and all staff are aware of how to identify and deal with both verbal and written requests.",
      help: "Give people clear and relevant information about their rights and how to exercise them. | Set out processes for dealing with requests from people about their rights in policies and procedures. | Deliver training and guidance to all staff on how to recognise a request and where to send them.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.1",
      severity: "critical",
      effort: "quick",
    },
    {
      id: "ico-4-2",
      question: "There are appropriate resources in place to handle requests from people about their information.",
      help: "Ensure there is a specific person or team in place that are responsible for managing and responding to requests. | Ensure staff receive specialised training to handle requests, including regular refresher training. | Have sufficient resources to deal with requests. | If a staff member is absent, train other staff to carry out key tasks. | Ensure you can deal with any increase in requests or reduction in staffing levels.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.2",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-4-3",
      question: "Verbal and written requests from people are logged and the log is updated to track the handling of each request.",
      help: "Put processes in place to ensure the log is accurate and updated as appropriate. | Show the due date for requests, the actual date of the final response and the action taken on the log. | Have a checklist that records the key stages in the request handling process, eg which systems or departments have been searched. This could be part of the log or a separate document. | Keep records of your organisation's request responses, and any disclosed or withheld information.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.3",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-4-4",
      question: "Requests from people are dealt with in a timely manner that meets their expectations and statutory timescales.",
      help: "Action all requests within statutory timescales. | Ensure staff responsible for managing requests meet regularly to discuss any issues and investigate, prioritise or escalate any delayed cases. | If you need an extension, update people on the progress of their request and keep them informed. | If a request is refused, have records about the reasons why and inform people about the reasons for any refusals or exemptions.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.4",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-4-5",
      question: "There is monitoring in place on how staff handle requests and that information is used to make improvements.",
      help: "Ensure staff responsible for managing requests meet regularly to discuss any issues. | Produce regular reports on performance and case quality assessments to ensure that requests are handled appropriately. | Share reports with senior management, that they review and action at appropriate meetings. | Analyse any trends in the nature or cause of requests to improve performance or reduce volumes.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.5",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-4-6",
      question: "There are appropriate systems and procedures to change inaccurate information, add additional information to incomplete records or add a supplementary statement where necessary.",
      help: "Take proportionate and reasonable steps to check the accuracy of the personal information held and, if necessary, be able to rectify it. | If your organisation is satisfied that the information is accurate, have a procedure to explain this to people. You need to inform  people of their right to complain, and as a matter of good practice, record on the system the fact that the person disputes the accuracy of the information. | If personal information has been disclosed to others, contact each recipient to inform them about the rectification, unless this is impossible or involves disproportionate effort. | If asked, tell people which third parties have received their personal information.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.6",
      severity: "high",
      effort: "significant",
    },
    {
      id: "ico-4-7",
      question: "There are appropriate methods and procedures in place to delete, suppress or otherwise stop processing personal information if required.",
      help: "Erase personal information from back-up systems as well as live systems where necessary, and clearly tell people what will happen to their information. | If the personal information is disclosed to others, contact each recipient to inform them about the erasure, unless this is impossible or involves disproportionate effort. | If asked to, tell people which third parties have received their personal information. | If personal information has been made public in an online environment, take reasonable steps to tell other controllers, if they are processing it, to erase links to, copies or replication of that information. | Give particular weight to a request for erasure where the processing is or was based on a child's consent, especially when processing any personal information on the internet.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.7",
      severity: "critical",
      effort: "significant",
    },
    {
      id: "ico-4-8",
      question: "There are appropriate methods and procedures in place to restrict the processing of personal information if required.",
      help: "Restrict personal information in a way appropriate for the type of processing and the system, for example temporarily moving the information to another system or removing it from a website. | If the personal information has been disclosed to others, contact each recipient to tell them about the restriction, unless this is impossible or involves disproportionate effort. | If asked to, tell the requestor which third parties have received their personal information.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.8",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-4-9",
      question: "People are able to move, copy or transfer their personal information to another organisation securely, without affecting the information.",
      help: "When requested, provide personal information in a structured, commonly used and machine readable format. | Where possible and if a person requests it, directly transmit the information to another organisation.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 4.9",
      severity: "medium",
      effort: "significant",
    },
    {
      id: "ico-4-10",
      question: "People's rights related to automated decision-making and profiling are protected, particularly where the processing is solely automated with legal or similarly significant effects.",
      help: "Complete additional checks for vulnerable groups, such as children, for all automated decision-making and profiling. | Only collect the minimum information needed and have a clear retention policy for the profiles created. | If your organisation uses solely automated decisions that have legal or similarly significant effects on people, have a recorded process to ensure these decisions only occur in accordance with article 22 of the UK GDPR. If this applies, carry out a data protection impact assessment (DPIA). | Where the decision is solely automated and has legal or similarly significant effects on people, ensure a recorded process allows simple ways for people to request human intervention, express their opinion and challenge a decision. | Conduct regular checks for accuracy and bias to ensure that systems are working as intended, and feed this back into the design process.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.10",
      severity: "critical",
      effort: "quick",
    },
    {
      id: "ico-4-11",
      question: "There are procedures to recognise and respond to people's complaints about data protection, and people are made aware of their right to complain.",
      help: "Implement procedures to handle data protection complaints raised by people and report their resolution to senior management. | Make the DPO's contact details or alternative contact points publicly available if people wish to raise a complaint about the use of their information. | Tell people about their right to make a complaint to the ICO in your privacy information.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 4.11",
      severity: "critical",
      effort: "quick",
    },
  ],
  transparency: [
    {
      id: "ico-5-1",
      question: "Privacy information or notice includes all the required information under Article 13 and 14 of the UK GDPR.",
      help: "Include all relevant contact information, eg the name and contact details of your organisation (and your representative if applicable) and the DPO's contact details. | Include the purposes of the processing and the lawful bases (and, if applicable, the legitimate interests for the processing). | Include the types of personal information you obtain and the information source, if the personal information is not obtained from the person it relates to. | Include details of all personal information that you share with other organisations and, if applicable, details of transfers to any third countries or international organisations. | Include retention periods for the personal information, or if that is not possible, the criteria used to determine the period. | Include details about people's rights including, if applicable, the right to withdraw consent and the right to make a complaint. | Include details of whether people are under a statutory or contractual obligation to provide the personal information (if applicable, and if you collect the personal information from the person it relates to). | Provide people with privacy information regarding the source of the personal information if you don't obtain it from the person concerned, eg if the information is from publicly accessible sources such as social media, the open electoral register or Companies House.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 5.1",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-5-2",
      question: "There is a recorded procedure to make sure that people receive privacy information at the right time, unless an exemption applies.",
      help: "Provide people with privacy information when their information is collected (eg when they fill in a form) or by observation (eg when using CCTV or people are tracked online). | If you obtain personal information from a source other than the person it relates to, provide privacy information to people, no later than one month after obtaining the information.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 5.2",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-5-3",
      question: "Privacy information is:  • concise; • transparent;  • intelligible;  • clear;  • uses plain language; and  • communicated in a way that is effective for the target audience.",
      help: "Proactively make people aware of privacy information and ensure they have a free, easy way to access it. | Provide privacy information to people in electronic and hard-copy form, using a combination of appropriate techniques, such as a layered approach, icons and mobile and smart device functionalities. | Write privacy information in clear and plain language that the intended audience can understand, and offer it in accessible formats if required. | Take particular care to write privacy information for children in clear, plain language, that is age-appropriate, and explains the risks involved in the processing and what safeguards are in place.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 5.3",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-5-4",
      question: "Processing relating to automated decision-making and profiling is transparent.",
      help: "Implement procedures for people to access the personal information you use to create profiles, so they can review for accuracy and edit it if needed. | If the decision is solely automated and has legal or similarly significant effects, tell people about the processing - including what information you are using, why and what the impact is likely to be. | If the purpose is initially unclear, give people an indication of what your organisation is going to do with their information, and proactively update your privacy information as this becomes clearer. | If the decision is solely automated and has legal or similarly significant effects, explain the processing in a meaningful way that enables people to exercise their rights including obtaining human intervention, expressing their point of view and contesting the decision.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 5.4",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-5-5",
      question: "Front-line staff are able to explain the necessary privacy information to people and provide guidance.",
      help: "Arrange organisation-wide staff training about privacy information. | Ensure front-line staff receive more specialised or specific training. | Make staff aware of the various ways in which the organisation provides privacy information.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 5.5",
      severity: "medium",
      effort: "moderate",
    },
    {
      id: "ico-5-6",
      question: "There are procedures in place to review the privacy information provided to people regularly to make sure that it is accurate, up to date and effective.",
      help: "Review privacy information against the records of processing activities, to ensure it remains up to date and that it accurately explains what happens with peoples personal information. | Maintain a log of historical privacy notices, including the dates you made any changes, in order to allow a review of what privacy information you provided to people and when. | Carry out user testing to evaluate the privacy information's effectiveness. | Analyse complaints from the public about how you use their personal information, and in particular, any complaints about how you explain that use. | If your organisation plans to use personal information for a new purpose, implement a procedure to update the privacy information and communicate the changes to people before starting any new processing.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 5.6",
      severity: "medium",
      effort: "moderate",
    },
    {
      id: "ico-5-7",
      question: "There is openness about how personal information is used, and tools are available to support transparency and control, especially when processing children's personal information.",
      help: "Ensure privacy policies are clear and easy for members of the public to access. | Provide people with tools, such as secure self-service systems, dashboards and just-in-time notices, so they can access, determine and manage how your organisation uses their personal information. | Offer strong privacy defaults and user-friendly options and controls. | Where relevant, have processes in place to help children exercise their data protection rights in an easily accessible way that they understand. | Implement appropriate measures to protect children using digital services.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 5.7",
      severity: "medium",
      effort: "significant",
    },
  ],
  records: [
    {
      id: "ico-6-1",
      question: "Comprehensive data mapping exercises are carried out, providing a clear understanding of what information is held and where.",
      help: "Carry out information audits (or data mapping exercises) to find out what personal information is held and to understand how the information flows through your organisation. | Keep the data map up to date and clearly assign the responsibilities for maintaining and amending it. | Consult staff to make sure that there is an accurate picture of processing activities, for example by using questionnaires and staff surveys.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.1",
      severity: "critical",
      effort: "significant",
    },
    {
      id: "ico-6-2",
      question: "There is a formal, documented, comprehensive and accurate record of all processing activities (ROPA) based on a data mapping exercise that is reviewed regularly.",
      help: "Record processing activities in electronic form so you can add, remove and amend information easily. | Review the record against processing activities, policies and procedures to ensure that it remains accurate and up to date, and clearly assign responsibilities for doing this. | Regularly review the processing activities and types of information you process for data minimisation purposes.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.2",
      severity: "critical",
      effort: "significant",
    },
    {
      id: "ico-6-3",
      question: "The ROPA contains all the relevant requirements set out in Article 30 of the UK GDPR.",
      help: "Ensure the ROPA includes (as a minimum): • Your organisation's name and contact details, whether it is a controller or a processor (and where applicable, the joint controller, their representative and the DPO); • the purposes of the processing; • a description of the categories of people and personal data; • the categories of recipients of personal data; • details of transfers to third countries, including a record of the transfer mechanism safeguards in place; • retention schedules; and • a description of the technical and organisational security measures in place. | Document an internal record of all processing activities carried out by any processors on behalf of your organisation.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.3",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-6-4",
      question: "The ROPA includes links to other relevant documentation, such as contracts or records as a matter of good practice.",
      help: "The ROPA also includes, or links to documentation covering: • information required for privacy notices, such as the lawful basis for the processing and the source of the personal data; • records of consent; • controller-processor contracts; • the location of personal data; •  DPIA reports; • records of personal data breaches; • information required for processing special category data or criminal conviction and offence data under the Data Protection Act 2018 (DPA 2018); and • retention and erasure policy documents.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 6.4",
      severity: "medium",
      effort: "quick",
    },
    {
      id: "ico-6-5",
      question: "The lawful basis for processing personal information is documented and appropriately justified in line with Article 6 of the UK GDPR (and Articles 9 and 10, if the processing involves special category or criminal offence data).",
      help: "Select the most appropriate lawful basis (or bases) for each activity following a review of the processing purposes. | Document the lawful basis (or bases) relied upon and the reasons why. | If your organisation processes special category or criminal offence data, identify and document a lawful basis for general processing and an additional condition for processing this type of information (or in the case of criminal offence data, identify the official authority to process). | In the case of special category or criminal offence data, document consideration of the requirements of Article 9 or 10 of the UK GDPR and Schedule 1 of the DPA 2018 where relevant. | Where Schedule 1 requires it, have an appropriate policy document including: • which Schedule 1 conditions you are relying upon; • what procedures you have in place to ensure compliance with the data protection principle; • how you will treat special category or criminal offence data for retention and erasure purposes; • a review date; and • details of the person assigned responsibility for the processing. | Identify the lawful basis before starting any new processing.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.5",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-6-6",
      question: "Information about the purpose of the processing and the lawful basis is made publicly available. This is easy to locate, access and read.",
      help: "Make information about the purposes of the processing, your lawful basis and relevant conditions for processing any special category or criminal offence data publicly available in your organisation's privacy notice(s). | Provide information in an easily understandable format. | If there is a genuine change in circumstances, or if your lawful basis must change due to a new and unanticipated purpose, inform people in a timely manner and record the changes.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.6",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-6-7",
      question: "When relying on consent for the processing of personal data, the consent mechanism is:  • specific;  • granular;  • prominent;  • opt-in;  • documented; and  • easily withdrawn.",
      help: "Ensure consent requests:  • are kept separate from other terms and conditions;  • require a positive opt-in and do not use pre-ticked boxes;  • are clear and specific (not a pre-condition of signing up to a service);  • inform people how to withdraw consent in an easy way; and  • give your organisation's name as well as the names of any third parties relying on consent. | Record what a person has consented to, including what they were told and when and how they consented. Ensure the records are thorough and easy for relevant staff to access, review and withdraw if required. | Have evidence and examples of how consent is sought from people, for example online forms or notices, opt-in tick boxes or paper-based forms.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.7",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-6-8",
      question: "There is a proactive review of records of previously gathered consent, which demonstrates a commitment to confirming and refreshing the consents.",
      help: "Have a procedure in place to review consents to check that the relationship, the processing and the purposes have not changed and to record any changes. | Have a procedure in place to refresh consent at appropriate intervals. | Use privacy dashboards or other preference management tools to help people manage their consent.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.8",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-6-9",
      question: "There are effective systems in place to conduct risk-based age checks and, where required, to obtain and record parental or guardian consent.",
      help: "Make reasonable efforts to check the age of those giving consent, particularly where the person is a child. | Ensure you have a reasonable and effective procedure to determine whether the person in question can provide their own consent, and if not, an effective way to gain and record parental or guardian consent. | When providing online services to children, ensure there are risk-based age checking systems in place to establish age, with an appropriate level of certainty based on the risks to children's rights and freedoms. | When providing online services to children, if the child is under 13, have records of parental or guardian consent which are regularly reviewed, and make reasonable efforts to verify that the person giving consent has parental responsibility. Give particular consideration when a child reaches the age of 13 and is able to provide their own consent.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.9",
      severity: "high",
      effort: "significant",
    },
    {
      id: "ico-6-10",
      question: "Where the lawful basis is legitimate interests, a legitimate interests assessment (LIA) has been completed prior to starting the processing.",
      help: "Ensure the LIA identifies the legitimate interest, the benefits of the processing and whether it is necessary. | Include a 'balancing test' to show how your organisation determines that its legitimate interests override the person's interests and consider the following issues: • not using people's data in intrusive ways or in ways which could cause harm, unless there is a very good reason; • protecting the interests of vulnerable groups such as people with learning disabilities or children; • whether you could introduce safeguards to reduce any potentially negative impact; • whether you could offer an opt-out; and • whether you require a DPIA. | Clearly document the decision and the assessment. | Complete the LIA prior to the start of the processing. | Keep the LIA under review and refresh it if changes affect the outcome.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 6.10",
      severity: "critical",
      effort: "significant",
    },
  ],
  contracts: [
    {
      id: "ico-7-1",
      question: "There are policies and procedures in place to make sure that data sharing decisions are appropriately managed.",
      help: "Implement a review process, through a DPIA or a similar exercise, to assess the legality, benefits and risks of the data sharing. | Document all sharing decisions for audit, monitoring and investigation purposes and regularly review them. | Have clear policies, procedures and guidance about data sharing, including who has the authority to make decisions about systematic data sharing or one-off disclosures, and when it is appropriate to do so. | Train all staff likely to make decisions about data sharing, and makes them aware of their responsibilities. Refresh this training appropriately.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 7.1",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-7-2",
      question: "There are data sharing agreements in place with parties with whom personal information is routinely shared. The agreements are reviewed regularly.",
      help: "Agree data sharing agreements with all the relevant parties and ensure senior management sign them off. | Ensure the data sharing agreement includes details about:  • the parties' roles; • the purpose of the data sharing;  • what is going to happen to the data at each stage; and  • sets standards (with a high privacy default for children). | Where necessary, implement procedures and guidance covering each organisation's day-to-day operations to support the agreements. | If your organisation is acting as a joint controller (within the meaning of Article 26 of the UK GDPR), set out responsibilities under an arrangement or a data sharing agreement and provide appropriate privacy information to people. | Have a regular review process to make sure that the information remains accurate and up to date, and to examine how the agreement is working. | Keep a central log of the current sharing agreements",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 7.2",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-7-3",
      question: "There are procedures in place to make sure that restricted transfers are made appropriately.",
      help: "Consider whether the restricted transfer is covered by an adequacy decision or by 'appropriate safeguards' listed in data protection law, such as contracts incorporating standard contractual data protection clauses adopted by the Commission or Binding Corporate Rules (BCRs). | If a restricted transfer is not covered by an adequacy decision nor an appropriate safeguard, consider whether it is covered by an exemption set out in Article 49 of the UK GDPR.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 7.3",
      severity: "critical",
      effort: "significant",
    },
    {
      id: "ico-7-4",
      question: "There are appropriate procedures in place regarding the work that processors do on behalf of the organisation.",
      help: "Ensure there are written contracts with all processors. | If using a processor, assess the risk to people and make sure that these risks are mitigated effectively. | Ensure an appropriate level of management approves the contracts and both parties sign. The level of management required for approval should be proportionate to the value and risk of the contract. | Ensure each contract (or other legal act) sets out details of the processing, including the: •  subject matter of the processing; •  duration of the processing; •  nature and purpose of the processing; •  type of personal information involved; •  categories of people; and •  controller's obligations and rights, in accordance with the list set out in Article 28(3) of the UK GDPR. | Keep a record or log of all current processor contracts, and update it when processors change. | Review contracts periodically to make sure they remain up to date. | If a processor uses a sub-processor to help with the processing it is doing on your behalf, ensure they have written authorisation from your organisation and a written contract with that sub-processor.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 7.4",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-7-5",
      question: "All controller-processor contracts cover the terms and clauses necessary to comply with data protection law.",
      help: "Ensure the contract or other legal act includes terms or clauses stating that the processor must: • only act on the controller's documented instructions, unless required by law to act without such instructions; • ensure that people processing the data are subject to a duty of confidence; • help the controller respond to requests from people to exercise their rights; and • submit to audits and inspections. | Contracts include the technical and organisational security measures the processor will adopt (including encryption, pseudonymisation, resilience of processing systems and backing up personal data in order to be able to reinstate the system). | The contract inlcudes clauses to make sure that the processor either deletes or returns all personal data to the controller at the end of the contract. The processor must also delete existing personal data unless the law requires its storage. | Clauses are included to make sure that the processor assists the controller in meeting its UK GDPR obligations regarding the security of processing, the notification of personal data breaches and DPIAs.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 7.5",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-7-6",
      question: "Due diligence checks are carried out to guarantee that processors will implement appropriate technical and organisational measures to meet UK GDPR requirements.",
      help: "Build in due diligence checks into the procurement process that are proportionate to the risk of the processing before you agree a contract with a processor. | Ensure the due diligence process includes data security checks, eg site visits, system testing and audit requests. | Ensure the due diligence process includes checks to confirm a potential processor will protect people's rights.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 7.6",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-7-7",
      question: "There is a review of data processors' compliance with their contracts.",
      help: "Ensure contracts include clauses to allow your organisation to conduct audits or checks, to confirm the processor is complying with all contractual terms and conditions. | Carry out routine compliance checks, proportionate to the processing risks, to test that processors are complying with contractual agreements.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 7.7",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-7-8",
      question: "There is evidence that 'data protection by design' is considered when selecting services and products to use in data processing activities.",
      help: "When third parties supply products or services to process personal information, choose suppliers that design their products or services with data protection in mind.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 7.8",
      severity: "medium",
      effort: "moderate",
    },
    {
      id: "ico-7-9",
      question: "There are proactive steps taken to only share necessary personal information with processors or other third parties.",
      help: "Only share the personal information necessary to achieve your specific purpose. | When information is shared, ensure it is pseudonymised or minimised wherever possible. Consider anonymisation so that the information is no longer personal information.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 7.9",
      severity: "medium",
      effort: "quick",
    },
  ],
  risks: [
    {
      id: "ico-8-1",
      question: "There are appropriate policies, procedures and measures to identify, record and manage information risks.",
      help: "Set out how your organisation and its data processors manage information risk in an information risk policy (either a separate document or part of a wider corporate risk policy), and decide how you monitor compliance with the information risk policy. | Have a process to help staff report and escalate information governance or data protection concerns and risks to a central point, for example staff forums. | Identify and manage information risks in an appropriate risk register, which includes clear links between corporate and departmental risk registers and the risk assessment of information assets. | Have formal procedures to identify, record and manage risks associated with information assets in an information asset register. | If you identify information risks, have appropriate action plans, progress reports and consider the lessons learnt to avoid future risk. | Put measures in place to mitigate the risks identified within risk categories, and test these regularly to make sure that they remain effective.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 8.1",
      severity: "critical",
      effort: "significant",
    },
    {
      id: "ico-8-2",
      question: "There is a data protection by design and by default approach to managing risks, and, as appropriate, DPIA requirements are built into policies and procedures.",
      help: "Reference DPIA requirements in all risk, project and change management policies and procedures, with links to DPIA policies and procedures. | Ensure procedures state that, if required, a DPIA should begin at the project's outset, before processing starts, and that the DPIA must run alongside the planning and development process. | Anticipate risks and privacy-invasive events before they occur, making sure that at the initial design phase of any system, product or process and throughout, you consider the:  • intended processing activities; • risks that these may pose to the rights and freedoms of people; and • possible measures available to mitigate the risks.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 8.2",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-8-3",
      question: "There is understanding of whether a DPIA is required, or where it would be good practice to complete one. There is a clear DPIA policy and procedure.",
      help: "Have a DPIA policy which includes: •  clear procedures to decide whether you conduct a DPIA;  •  what the DPIA should cover; •   who will authorise it; and •  how you will incorporate it into the overall planning. | Have a screening checklist to consider if you need a DPIA, including all the relevant considerations on the scope, type and manner of the proposed processing. | If the screening checklist indicates that you do not need a DPIA, document this. | Ensure your procedure includes the requirement to seek advice from the DPO and other internal staff as appropriate. | Ensure your procedure includes consultation with controllers,  processors, people, their representatives and any other relevant stakeholders as appropriate. | Include the need to consider a DPIA at the early stages of any plan involving personal information in your training and, where relevant, train staff in how to carry out a DPIA. | Assign responsibility for completing DPIAs to a member of staff, who has enough authority over a project to effect change, eg a project lead or manager.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 8.3",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-8-4",
      question: "DPIAs always include the appropriate information and are comprehensively documented.",
      help: "Implement a standard, well-structured DPIA template which is written in plain English. | Ensure DPIAs: •  include the nature, scope, context and purposes of the processing; •  assess necessity, proportionality and compliance measures; •  identify and assess risks to people; and  •  identify any additional measures to mitigate those risks. | Ensure DPIAs clearly set out the relationships and data flows between controllers, processors, people and systems. | Ensure DPIAs identify measures that eliminate, mitigate or reduce high risks. | Have a documented process, with appropriate document controls, that is reviewed periodically to ensure it remains up to date. | Record your DPO's advice and recommendations and the details of any other consultations. | Ensure appropriate people sign off DPIAs, such as a project lead or senior manager.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 8.4",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-8-5",
      question: "There are appropriate and effective actions taken to mitigate or manage any risks a DPIA identifies, and there is a DPIA review process.",
      help: "Have a procedure to consult the ICO if you cannot mitigate residual high risks. | Integrate outcomes from DPIAs into relevant work plans, project action plans and risk registers. | Do not start high risk processing until mitigating measures are in place following the DPIA. | Have a procedure to communicate the outcomes of DPIAs to appropriate stakeholders, eg through a formal summarised report. | Consider actively publishing DPIAs where possible, removing sensitive details if necessary. | Agree and document a schedule for reviewing the DPIA regularly or when the nature, scope, context or purposes of the processing changes.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 8.5",
      severity: "high",
      effort: "moderate",
    },
  ],
  security: [
    {
      id: "ico-9-1",
      question: "There are minimum standards for the creation of records and effective mechanisms to locate and retrieve records.",
      help: "Implement policies and procedures to ensure that you appropriately classify, title and index new records in a way that facilitates management, retrieval and disposal. | Identify where you use manual and electronic record-keeping systems and maintain a central log or information asset register. | Know the whereabouts of records at all times, track their movements, and make attempts to trace records that are missing or not returned. | Index records stored off-site with unique references to enable accurate retrieval and subsequent tracking.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.1",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-9-2",
      question: "There are appropriate security measures in place to protect information that is in transit, information received or information transferred to another organisation.",
      help: "Document rules to protect the internal and external transfer of records by post, fax and electronically, for example in a transfer policy or guidance. | Minimise information transferred off-site and keep it secure in transit. | When you transfer information off site, use an appropriate form of transport (for example secure courier, encryption, secure file transfer protocol (SFTP) or Virtual Private Network (VPN)) and make checks to ensure the information has been received. | Have agreements in place with any third parties used to transfer business information between your organisation and third parties.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.2",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-9-3",
      question: "There are procedures in place to make sure that records containing personal information are accurate, adequate and not excessive.",
      help: "Conduct regular data quality reviews of records containing personal information to make sure they are accurate, adequate and not excessive. | Make staff aware of data quality issues following data quality checks or audits to prevent recurrence. | Weed records containing personal information (whether active or archived) periodically to reduce the risks of inaccuracies and excessive retention.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.3",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-9-4",
      question: "There is an appropriate retention schedule outlining storage periods for all personal information, which is reviewed regularly.",
      help: "Have a retention schedule based on business need with reference to statutory requirements and other principles (for example the National Archives). | Ensure the schedule provides sufficient information to identify all records and to implement disposal decisions in line with the schedule. | Assign responsibilities to make sure that staff adhere to the schedule and you review it regularly. | Regularly review retained information to identify opportunities for minimisation, pseudonymisation or anonymisation and document this in the schedule.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.4",
      severity: "critical",
      effort: "significant",
    },
    {
      id: "ico-9-5",
      question: "Methods of destruction are covered in a policy and they are appropriate to prevent disclosure of personal information prior to, during or after disposal.",
      help: "For paper documents, use locked waste bins for records containing personal information, and either in-house or third party cross shredding or incineration is in place. | For information held on electronic devices, wiping, degaussing or secure destruction of hardware (shredding) is in place. | Hold, collect or send away securely confidential waste awaiting destruction. | Have appropriate contracts in place with third parties to dispose of personal information, that provide you with appropriate assurance that they have securely disposed of the information, for example through audit checks and destruction certificates. | Have a log of all equipment and confidential waste sent for disposal or destruction.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.5",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-9-6",
      question: "There is an asset register that records assets, systems and applications used for processing or storing personal information across the organisation.",
      help: "Have an asset register that holds details of all information assets (software and hardware) including:  • asset owners;  • asset location;  • retention periods; and  • security measures deployed. | Review the register periodically to make sure it remains up to date and accurate. | Periodically risk-assess assets within the register and have physical checks to make sure that the hardware asset inventory remains accurate.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.6",
      severity: "high",
      effort: "significant",
    },
    {
      id: "ico-9-7",
      question: "Identify, document and implement rules for the acceptable use of software (systems or applications) processing or storing information.",
      help: "Have acceptable use or terms and conditions of use procedures in place. | Have system operating procedures which document the security arrangements and measures in place to protect the information held within systems or applications. | Monitor compliance with acceptable use rules and make sure that staff are aware of any monitoring.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 9.7",
      severity: "medium",
      effort: "moderate",
    },
    {
      id: "ico-9-8",
      question: "Access to personal information is limited to authorised staff only and users' access rights are regularly reviewed.",
      help: "Have an access control policy which specifies that users must follow your organisation's practices in the use of secret authentication information, for example passwords or tokens. | Implement a formal user access provisioning procedure to assign access rights for staff (including temporary staff) and third-party contractors to all relevant systems and services required to fulfil their role, for example 'new starter process'. | Restrict and control the allocation and use of privileged access rights. | Keep a log of user access to systems holding personal information. | Regularly review users' access rights and adjust or remove rights where appropriate, for example when an employee changes role or leaves the organisation.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.8",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-9-9",
      question: "Unauthorised access to systems and applications is prevented, for example by passwords, technical vulnerability management and malware prevention tools.",
      help: "Restrict access to systems or applications processing personal information to the absolute minimum in accordance with the principle of least privilege (for example read/write/delete/execute access rules are applied). | Apply minimum password complexity rules and limited log on attempts to systems or applications processing personal information. | Have password management controls in place, including default password changing, controlled use of any shared passwords and secure password storage (not in plain text). | Use email content and attachment security solutions (encryption) to appropriately protect emails containing sensitive personal information. | Log and monitor user and system activity to detect anything unusual. | Implement anti-malware and anti-virus (AV) protection across the network and on critical or sensitive information systems if appropriate. | Keep anti-malware and anti-virus protection iup-to-date and configure it to perform regular scans. | Ensue your organisation has access to and acts upon any updates on technical vulnerabilities to systems or software, for example vendor's alerts or patches. | Regularly run vulnerability scans. | Deploy URL or web content filtering to block specific websites or entire categories. | Strictly control or prohibit the use of social media, or messaging apps such as WhatsApp to share personal information. | Have external and internal firewalls and intrusion detection systems in place as appropriate to ensure the security of information in networks and systems from unauthorised access or attack, for example denial of service attacks. | Do not have unsupported operating systems in use, for example Windows XP or Windows Server 2003. | Establish special controls to safeguard the confidentiality and integrity of information passing over public networks or over wireless networks and to protect the connected systems and applications.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.9",
      severity: "critical",
      effort: "significant",
    },
    {
      id: "ico-9-10",
      question: "There are appropriate mechanisms in place to manage the security risks of using mobile devices, home or remote working and removable media.",
      help: "Have a mobile device and a home/remote working policy that demonstrates how your organisation will manage the associated security risks. | Have protections in place to avoid the unauthorised access to or disclosure of the information processed by mobile devices, for example, encryption and remote wiping capabilities. | Implement security measures to protect information processed when home or remote working, for example VPN and two-factor authentication. | Where you have a business need to store personal information on removable media, minimise personal information and implement a software solution that can set permissions or restrictions for individual devices as well as an entire class of devices. | Use the most up-to-date version of your remote access solution. Support and update devices remotely. | Do not allow equipment, information or software to be taken off-site without prior authorisation and have a log of all mobile devices and removable media used and who they are allocated to.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.10",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-9-11",
      question: "Physical business locations are secured to prevent unauthorised access, damage and interference to personal information.",
      help: "Protect secure areas (areas that contain either sensitive or critical information) by appropriate entry controls such as doors and locks, alarms, security lighting or CCTV. | Have visitor protocols in place such as signing-in procedures, name badges and escorted access. | Implement additional protection against external and environmental threats in secure areas such as server rooms. | Ensure office equipment is appropriately placed and protected to reduce the risks from environmental threats and opportunities for unauthorised access. | Securely store paper records and control access to them. | Operate a clear desk policy across your organisation where personal information is processed. | Have regular clear desk 'sweeps' or checks and issues are fed back appropriately | Operate a 'clear screen' policy across your organisation where personal information is processed.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.11",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-9-12",
      question: "There are plans to deal with serious disruption, and back up key systems, applications and information to protect against loss of personal information.",
      help: "Have a risk-based Business Continuity Plan to manage disruption and a Disaster Recovery Plan to manage disasters, which identify records that are critical to the continued functioning of your organisation. | Take back-up copies of electronic information, software and systems (and ideally store them off-site). | Ensure the frequency of backups reflects the sensitivity and importance of the information. | Regularly test back-ups and recovery processes to ensure they remain fit for purpose.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 9.12",
      severity: "high",
      effort: "moderate",
    },
  ],
  breach: [
    {
      id: "ico-10-1",
      question: "There are procedures in place to make sure that personal data incidents and breaches are detected, managed and appropriately recorded.",
      help: "Have appropriate training in place so that staff are able to recognise a security incident and a personal data breach. | Appoint a dedicated person or team to manage security incidents and personal data breaches. | Ensure staff know how to escalate a security incident promptly to the appropriate person or team to determine whether a breach has occurred. | Ensure procedures and systems facilitate the reporting of security incidents and breaches. | Implement a response plan for promptly addressing any security incidents and personal data breaches that occur. | Centrally log, record and document both actual breaches and near misses (even if they do not need to be reported to the ICO or people). | Documents in the log the facts relating to the near miss or breach including:  • its causes;  • what happened;  • the personal data affected;  • the effects of the breach; and  • any remedial action taken and rationale.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 10.1",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-10-2",
      question: "There are procedures to assess all security incidents and then report relevant breaches to the ICO within the statutory time frame.",
      help: "Have a procedure to assess the likelihood and severity of the risk to people as a result of a personal data breach. | Have a procedure to notify the ICO of a breach within 72 hours of becoming aware of it (even when all the information is not yet available) and notify the ICO on time. | Ensure the procedure includes details of what information must be given to the ICO about the breach. | If you consider it unnecessary to report a breach, document the reasons why your organisation considers the breach unlikely to result in a risk to the rights and freedoms of people.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 10.2",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-10-3",
      question: "There are procedures to notify affected people where the breach is likely to result in a high risk to their rights and freedoms.",
      help: "Have a procedure setting out how you will tell affected people about a breach when it is likely to result in a high risk to their rights and freedoms. | Tell people about personal data breaches in clear, plain language without undue delay | Ensure the information you provide to people includes the DPO's details, a description of the likely consequences of the breach and the measures taken (including mitigating actions and any possible adverse effects). | Provide people with advice to protect themselves from any effects of the breach.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 10.3",
      severity: "critical",
      effort: "moderate",
    },
    {
      id: "ico-10-4",
      question: "Personal data breaches are reviewed and monitored.",
      help: "Analyse all personal data breach reports to prevent a recurrence. | Monitor the type, volume and cost of incidents. | Undertake trend analysis on breach reports over time to understand themes or issues. | Ensure groups with oversight for data protection and information governance review the outputs.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 10.4",
      severity: "high",
      effort: "moderate",
    },
    {
      id: "ico-10-5",
      question: "There are external data protection and information governance audits or other compliance checking procedures.",
      help: "Complete externally-provided self-assessment tools to provide assurances on data protection and information security compliance. | Ensure your organisation is subject to or employs the services of an external auditor to provide independent assurances (or certification) on data protection and information security compliance. | Adhere to an appropriate code of conduct or practice for your sector (if one exists). | Produce audit reports to document the findings. | Have a central action plan in place to take forward the outputs from data protection and information governance audits.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 10.5",
      severity: "medium",
      effort: "significant",
    },
    {
      id: "ico-10-6",
      question: "There is an internal audit programme, covering data protection and related information governance (for example security and records management) in sufficient detail.",
      help: "Monitor your own data protection compliance and regularly test the effectiveness of the measures you have in place. | Regularly test staff adherence to data protection and information governance policies and procedures. | Routinely conduct informal ad-hoc monitoring and spot checks. | Ensure your monitoring of policy compliance is unbiased by keeping it separate from those who implement the policies. | Have a central audit plan/schedule in place to show the planning of data protection and information governance internal audits. | Produce audit reports to document the findings. | Have a central action plan in place to take forward the outputs from data protection and information governance audits.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 10.6",
      severity: "high",
      effort: "significant",
    },
    {
      id: "ico-10-7",
      question: "There are business targets relating to data protection compliance and information governance, and access to the relevant information to assess against them.",
      help: "Have KPIs regarding subject access request (SAR) performance (the volume of requests and the percentage completed within statutory timescales). | Have KPIs regarding the completion of data protection and information governance training, including a report showing the percentage of staff who complete training. | Have KPIs regarding information security, including the number of security breaches, incidents and near misses. | Have KPIs regarding records management, including the use of metrics such as file retrieval statistics, adherence to disposal schedules and the performance of the system in place to index and track paper files containing personal information.",
      weight: 2,
      icoRef: "ICO Accountability Framework: Expectation 10.7",
      severity: "medium",
      effort: "moderate",
    },
    {
      id: "ico-10-8",
      question: "Relevant management information and the outcomes of monitoring and review activity are communicated to relevant internal stakeholders, including senior management as appropriate. This information informs discussions and actions.",
      help: "Have a dashboard giving a high-level summary of all key data protection and information governance KPIs. | Regularly discuss KPIs and the outcomes of monitoring and reviews at the group(s) providing oversight of data protection and information governance. | Discuss data protection and information governance KPIs and the outcomes of monitoring and reviews at groups at operational level, for example in team meetings.",
      weight: 3,
      icoRef: "ICO Accountability Framework: Expectation 10.8",
      severity: "high",
      effort: "moderate",
    },
  ],
};

// ── Scoring and gap analysis logic ──
const SEVERITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 };
const EFFORT_SCORE = { quick: 3, moderate: 2, significant: 1 };
const SEVERITY_LABELS = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
const SEVERITY_COLORS = { critical: "#dc2626", high: "#ea580c", medium: "#d97706", low: "#65a30d" };
const EFFORT_LABELS = { quick: "Quick win (< 1 day)", moderate: "Moderate (1–5 days)", significant: "Significant (> 5 days)" };

function computeSectionScore(sectionId, answers) {
  const qs = QUESTIONS[sectionId] || [];
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let answered = 0;
  let compliant = 0;
  let partial = 0;
  let gap = 0;
  let na = 0;
  qs.forEach((q) => {
    const a = answers[q.id];
    if (!a) return;
    answered++;
    if (a === "na") { na++; return; }
    const opt = OPTIONS.find((o) => o.value === a);
    totalWeightedScore += opt.score * q.weight;
    totalWeight += 3 * q.weight;
    if (a === "yes") compliant++;
    else if (a === "partial") partial++;
    else if (a === "no") gap++;
  });
  const pct = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;
  return { pct, answered, compliant, partial, gap, na, total: qs.length, unanswered: qs.length - answered };
}

function computeOverallScore(answers) {
  let totalWeighted = 0;
  let totalMax = 0;
  Object.keys(QUESTIONS).forEach((sectionId) => {
    QUESTIONS[sectionId].forEach((q) => {
      const a = answers[q.id];
      if (!a || a === "na") return;
      const opt = OPTIONS.find((o) => o.value === a);
      totalWeighted += opt.score * q.weight;
      totalMax += 3 * q.weight;
    });
  });
  return totalMax > 0 ? Math.round((totalWeighted / totalMax) * 100) : 0;
}

function getScoreLabel(pct) {
  if (pct >= 80) return { label: "Strong", color: "#22c55e", bg: "#f0fdf4" };
  if (pct >= 60) return { label: "Developing", color: "#f59e0b", bg: "#fffbeb" };
  if (pct >= 40) return { label: "Weak", color: "#f97316", bg: "#fff7ed" };
  return { label: "Critical gaps", color: "#ef4444", bg: "#fef2f2" };
}

function getGapRecommendations(answers) {
  const recs = [];
  Object.keys(QUESTIONS).forEach((sectionId) => {
    const section = SECTIONS.find((s) => s.id === sectionId);
    QUESTIONS[sectionId].forEach((q) => {
      const a = answers[q.id];
      if (a === "no" || a === "partial") {
        const severity = q.severity || (q.weight === 3 ? "high" : q.weight === 2 ? "medium" : "low");
        const effort = q.effort || "moderate";
        const sevWeight = SEVERITY_WEIGHT[severity] || 2;
        const effScore = EFFORT_SCORE[effort] || 2;
        const priorityScore = sevWeight * 2 + effScore + (a === "no" ? 1 : 0);
        recs.push({
          sectionLabel: section.label,
          sectionId,
          question: q.question,
          answer: a,
          weight: q.weight,
          icoRef: q.icoRef,
          help: q.help,
          severity,
          effort,
          remediation: q.help,
          priorityScore,
        });
      }
    });
  });
  recs.sort((a, b) => b.priorityScore - a.priorityScore);
  return recs;
}

function getExecutiveSummary(overall, recs, totalAnswered, totalQuestions) {
  const critical = recs.filter(r => r.severity === "critical").length;
  const high = recs.filter(r => r.severity === "high").length;
  const medium = recs.filter(r => r.severity === "medium").length;
  const low = recs.filter(r => r.severity === "low").length;
  const quickWins = recs.filter(r => r.effort === "quick").length;
  let narrative = "";
  if (overall >= 80) {
    narrative = "Your organisation demonstrates a strong accountability posture against the ICO's expectations. The gaps identified are relatively minor and can be addressed through targeted improvements. Focus on the action plan items below to strengthen an already solid foundation.";
  } else if (overall >= 60) {
    narrative = "Your organisation has developing accountability practices with some notable gaps. The foundations are in place but key areas need strengthening. The ICO would expect to see active progress on the critical and high-severity items identified below.";
  } else if (overall >= 40) {
    narrative = "Your accountability framework has material weaknesses. The ICO considers failure to comply with its guidance an aggravating factor in enforcement. Immediate action is needed on the critical items, followed by systematic work through the prioritised action plan.";
  } else {
    narrative = "Your organisation has significant gaps in its accountability framework. In an ICO audit or investigation, these gaps would represent serious aggravating factors. Urgent remediation is required, starting with the critical items identified below. Consider engaging specialist support.";
  }
  return { narrative, critical, high, medium, low, quickWins };
}

// ── Shared styles ──
const FONT_BODY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";
const FONT_HEADING = "'Source Serif 4', Georgia, serif";
const COLOR_TEXT = "#37352f";
const COLOR_MUTED = "#6b6b6b";
const COLOR_FAINT = "#9b9a97";
const COLOR_BORDER = "#e8e5e0";
const COLOR_BG = "#ffffff";
const COLOR_BG_HOVER = "#f7f6f3";
const COLOR_ACCENT = "#2563eb";

// ── Main component ──
export default function ICOAccountabilityAdvanced() {
  const [screen, setScreen] = useState("intake");
  const [orgName, setOrgName] = useState("");
  const [orgSector, setOrgSector] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [orgRole, setOrgRole] = useState("");
  const [activeSection, setActiveSection] = useState("leadership");
  const [answers, setAnswers] = useState({});
  const [expandedHelp, setExpandedHelp] = useState({});
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const mainRef = useRef(null);

  const allSectors = [
    "Financial services",
    "Healthcare / NHS",
    "Education",
    "Local government",
    "Central government",
    "Retail / e-commerce",
    "Technology",
    "Legal services",
    "Professional services",
    "Telecoms / media",
    "Energy / utilities",
    "Manufacturing",
    "Charity / non-profit",
    "Other",
  ];

  const canStart = orgName.trim().length > 0;
  const handleAnswer = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = Object.values(QUESTIONS).reduce((sum, qs) => sum + qs.length, 0);
  const completionPct = totalQuestions > 0 ? totalAnswered / totalQuestions : 0;
  const meetsThreshold = completionPct >= COMPLETION_THRESHOLD;
  const requiredCount = Math.ceil(totalQuestions * COMPLETION_THRESHOLD);

  // ── Styles ──
  const pageStyle = {
    minHeight: "100vh",
    background: COLOR_BG,
    fontFamily: FONT_BODY,
    color: COLOR_TEXT,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    padding: "12px 24px",
    borderBottom: `1px solid ${COLOR_BORDER}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    background: COLOR_BG,
    zIndex: 100,
  };

  const contentStyle = {
    flex: 1,
    maxWidth: "680px",
    width: "100%",
    margin: "0 auto",
    padding: "60px 24px 80px",
  };

  // ── Render functions ──
  const renderHeader = () => (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT }}>AiLA</span>
        <span style={{ color: "#d3d1cb" }}>·</span>
        <span style={{ fontSize: "13px", color: COLOR_FAINT }}>ICO Accountability Assessment (Comprehensive)</span>
      </div>
      {screen === "questionnaire" && (
        <span style={{ fontSize: "12px", color: COLOR_FAINT }}>
          {totalAnswered} / {totalQuestions} answered
          {!meetsThreshold && (
            <span style={{ marginLeft: "8px", color: "#d97706" }}>
              ({requiredCount - totalAnswered} more needed for report)
            </span>
          )}
        </span>
      )}
      {screen !== "questionnaire" && (
        <a href="https://trustaila.com" target="_blank" rel="noopener noreferrer" style={{
          fontSize: "12px", color: COLOR_FAINT, textDecoration: "none"
        }}>trustaila.com</a>
      )}
    </header>
  );

  const renderIntake = () => (
    <div style={contentStyle}>
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{
          fontFamily: FONT_HEADING,
          fontSize: "40px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 12px",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>ICO Accountability Assessment — Comprehensive</h1>
        <p style={{ fontSize: "16px", color: COLOR_MUTED, margin: "0 0 8px", lineHeight: 1.6 }}>
          Assess your organisation against the ICO's Accountability Framework tracker — a comprehensive evaluation covering all 77 questions across the 10 ICO categories. Based directly on the official framework expectations.
        </p>
        <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: 0, lineHeight: 1.6 }}>
          77 questions across 10 categories · Takes 30–40 minutes · Generates a prioritised action plan with detailed ICO references
        </p>
      </div>

      {/* Org name */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "8px" }}>
          Organisation name <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Enter your organisation name"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: `1px solid ${COLOR_BORDER}`,
            borderRadius: "4px",
            fontSize: "15px",
            fontFamily: FONT_BODY,
            color: COLOR_TEXT,
            background: COLOR_BG,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Sector */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Sector
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          The ICO's expectations are risk-based — sector affects what 'proportionate' means for your organisation
        </p>
        <select
          value={orgSector}
          onChange={(e) => setOrgSector(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: `1px solid ${COLOR_BORDER}`,
            borderRadius: "4px",
            fontSize: "15px",
            fontFamily: FONT_BODY,
            color: orgSector ? COLOR_TEXT : COLOR_FAINT,
            background: COLOR_BG,
            outline: "none",
            boxSizing: "border-box",
          }}
        >
          <option value="">Select sector</option>
          {allSectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Org size */}
      <div style={{ marginBottom: "32px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Approximate number of employees
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          The ICO's framework is designed for larger organisations — smaller organisations may benefit from the ICO's SME toolkit instead
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["1–49", "50–249", "250–999", "1,000–4,999", "5,000+"].map((size) => (
            <button
              key={size}
              onClick={() => setOrgSize(size)}
              style={{
                padding: "8px 16px",
                border: `1px solid ${orgSize === size ? COLOR_ACCENT : COLOR_BORDER}`,
                borderRadius: "4px",
                background: orgSize === size ? `${COLOR_ACCENT}0a` : COLOR_BG,
                color: orgSize === size ? COLOR_ACCENT : COLOR_TEXT,
                fontSize: "14px",
                fontFamily: FONT_BODY,
                cursor: "pointer",
                fontWeight: orgSize === size ? 600 : 400,
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <div style={{ marginBottom: "48px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, marginBottom: "4px" }}>
          Your role
        </label>
        <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: "0 0 8px" }}>
          Helps us understand who is completing the assessment
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {["DPO", "Senior management", "Legal / compliance", "IT / security", "Other"].map((role) => (
            <button
              key={role}
              onClick={() => setOrgRole(role)}
              style={{
                padding: "8px 16px",
                border: `1px solid ${orgRole === role ? COLOR_ACCENT : COLOR_BORDER}`,
                borderRadius: "4px",
                background: orgRole === role ? `${COLOR_ACCENT}0a` : COLOR_BG,
                color: orgRole === role ? COLOR_ACCENT : COLOR_TEXT,
                fontSize: "14px",
                fontFamily: FONT_BODY,
                cursor: "pointer",
                fontWeight: orgRole === role ? 600 : 400,
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => { setScreen("questionnaire"); }}
        disabled={!canStart}
        style={{
          padding: "12px 32px",
          background: canStart ? COLOR_TEXT : "#d3d1cb",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: FONT_BODY,
          cursor: canStart ? "pointer" : "not-allowed",
          transition: "background 0.15s",
        }}
      >
        Begin assessment
      </button>
    </div>
  );

  const renderSidebar = () => (
    <div style={{
      width: "240px",
      flexShrink: 0,
      borderRight: `1px solid ${COLOR_BORDER}`,
      padding: "16px 0",
      position: "sticky",
      top: "49px",
      height: "calc(100vh - 49px)",
      overflowY: "auto",
      background: COLOR_BG,
    }}>
      {SECTIONS.map((sec) => {
        const stats = computeSectionScore(sec.id, answers);
        const isActive = activeSection === sec.id;
        const allAnswered = stats.unanswered === 0;
        return (
          <button
            key={sec.id}
            onClick={() => { setActiveSection(sec.id); mainRef.current?.scrollTo(0, 0); }}
            style={{
              display: "block",
              width: "100%",
              padding: "10px 16px",
              border: "none",
              background: isActive ? COLOR_BG_HOVER : "transparent",
              cursor: "pointer",
              textAlign: "left",
              borderLeft: isActive ? `2px solid ${COLOR_TEXT}` : "2px solid transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
              <span style={{
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? COLOR_TEXT : COLOR_MUTED,
              }}>{sec.label}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {allAnswered && stats.total > 0 ? (
                <span style={{ fontSize: "12px", color: getScoreLabel(stats.pct).color, fontWeight: 600 }}>
                  {stats.pct}%
                </span>
              ) : stats.answered > 0 ? (
                <span style={{ fontSize: "12px", color: COLOR_FAINT }}>
                  {stats.answered}/{stats.total}
                </span>
              ) : (
                <span style={{ fontSize: "12px", color: COLOR_FAINT }}>—</span>
              )}
              {stats.gap > 0 && <span style={{ fontSize: "11px", color: "#ef4444" }}>● {stats.gap} gap{stats.gap > 1 ? "s" : ""}</span>}
            </div>
          </button>
        );
      })}
      {/* View results button */}
      <div style={{ padding: "16px", borderTop: `1px solid ${COLOR_BORDER}`, marginTop: "8px" }}>
        <button
          onClick={() => setScreen("results")}
          disabled={!meetsThreshold}
          title={!meetsThreshold ? `Answer at least ${requiredCount} questions (${totalAnswered} answered so far)` : ""}
          style={{
            width: "100%",
            padding: "10px 0",
            background: meetsThreshold ? COLOR_TEXT : "#d3d1cb",
            color: "#ffffff",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: FONT_BODY,
            cursor: meetsThreshold ? "pointer" : "not-allowed",
          }}
        >
          View results
        </button>
        <p style={{ fontSize: "11px", color: COLOR_FAINT, margin: "6px 0 0", textAlign: "center" }}>
          {totalAnswered}/{totalQuestions} answered
          {!meetsThreshold && (
            <span style={{ display: "block", color: "#d97706", marginTop: "2px" }}>
              {requiredCount - totalAnswered} more needed (80% required)
            </span>
          )}
        </p>
      </div>
    </div>
  );

  const renderQuestion = (q) => {
    const current = answers[q.id];
    const isHelpOpen = expandedHelp[q.id];
    const helpItems = q.help.split(" | ");
    return (
      <div
        key={q.id}
        style={{
          padding: "24px 0",
          borderBottom: `1px solid ${COLOR_BORDER}`,
        }}
      >
        <p style={{ fontSize: "15px", color: COLOR_TEXT, margin: "0 0 4px", lineHeight: 1.5, fontWeight: 500 }}>
          {q.question}
        </p>
        {q.weight === 3 && (
          <span style={{
            display: "inline-block",
            fontSize: "11px",
            color: COLOR_ACCENT,
            background: `${COLOR_ACCENT}0a`,
            border: `1px solid ${COLOR_ACCENT}22`,
            borderRadius: "3px",
            padding: "1px 6px",
            marginBottom: "8px",
            fontWeight: 600,
          }}>High priority</span>
        )}
        {/* Answer buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "12px 0" }}>
          {OPTIONS.map((opt) => {
            const selected = current === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleAnswer(q.id, opt.value)}
                style={{
                  padding: "7px 14px",
                  border: `1px solid ${selected ? opt.color : COLOR_BORDER}`,
                  borderRadius: "4px",
                  background: selected ? `${opt.color}0a` : COLOR_BG,
                  color: selected ? opt.color : COLOR_TEXT,
                  fontSize: "13px",
                  fontFamily: FONT_BODY,
                  cursor: "pointer",
                  fontWeight: selected ? 600 : 400,
                  transition: "all 0.12s",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {/* Help toggle */}
        <button
          onClick={() => setExpandedHelp((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "13px",
            color: COLOR_FAINT,
            cursor: "pointer",
            fontFamily: FONT_BODY,
          }}
        >
          {isHelpOpen ? "Hide guidance ▴" : "Show guidance ▾"}
        </button>
        {isHelpOpen && (
          <div style={{
            marginTop: "8px",
            padding: "12px 16px",
            background: COLOR_BG_HOVER,
            borderRadius: "4px",
            borderLeft: `3px solid ${COLOR_BORDER}`,
          }}>
            {helpItems.length > 1 ? (
              <ul style={{ margin: "0 0 8px", paddingLeft: "20px" }}>
                {helpItems.map((item, idx) => (
                  <li key={idx} style={{ fontSize: "13px", color: COLOR_MUTED, margin: "0 0 6px", lineHeight: 1.6 }}>
                    {item.trim()}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: "13px", color: COLOR_MUTED, margin: "0 0 8px", lineHeight: 1.6 }}>
                {q.help}
              </p>
            )}
            <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, fontStyle: "italic" }}>
              Source: {q.icoRef}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionnaire = () => {
    const sectionMeta = SECTIONS.find((s) => s.id === activeSection);
    const sectionQuestions = QUESTIONS[activeSection] || [];
    const sectionIdx = SECTIONS.findIndex((s) => s.id === activeSection);
    return (
      <div style={{ display: "flex", minHeight: "calc(100vh - 49px)" }}>
        {renderSidebar()}
        <div
          ref={mainRef}
          style={{
            flex: 1,
            overflowY: "auto",
            height: "calc(100vh - 49px)",
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 32px 80px" }}>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: COLOR_FAINT }}>{sectionMeta.icon}</span>
            </div>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "28px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 8px",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}>{sectionMeta.label}</h2>
            <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: "0 0 24px" }}>
              {sectionQuestions.length} questions
            </p>
            {sectionQuestions.map(renderQuestion)}
            {/* Section navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
              {sectionIdx > 0 ? (
                <button
                  onClick={() => { setActiveSection(SECTIONS[sectionIdx - 1].id); mainRef.current?.scrollTo(0, 0); }}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${COLOR_BORDER}`,
                    borderRadius: "4px",
                    background: COLOR_BG,
                    color: COLOR_TEXT,
                    fontSize: "13px",
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  ← {SECTIONS[sectionIdx - 1].label}
                </button>
              ) : <div />}
              {sectionIdx < SECTIONS.length - 1 ? (
                <button
                  onClick={() => { setActiveSection(SECTIONS[sectionIdx + 1].id); mainRef.current?.scrollTo(0, 0); }}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${COLOR_BORDER}`,
                    borderRadius: "4px",
                    background: COLOR_BG,
                    color: COLOR_TEXT,
                    fontSize: "13px",
                    fontFamily: FONT_BODY,
                    cursor: "pointer",
                  }}
                >
                  {SECTIONS[sectionIdx + 1].label} →
                </button>
              ) : (
                <button
                  onClick={() => meetsThreshold && setScreen("results")}
                  disabled={!meetsThreshold}
                  title={!meetsThreshold ? `Answer at least ${requiredCount} questions (${totalAnswered} answered so far)` : ""}
                  style={{
                    padding: "8px 20px",
                    border: "none",
                    borderRadius: "4px",
                    background: meetsThreshold ? COLOR_TEXT : "#d3d1cb",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: FONT_BODY,
                    cursor: meetsThreshold ? "pointer" : "not-allowed",
                  }}
                >
                  {meetsThreshold ? "View results →" : `${requiredCount - totalAnswered} more to unlock results`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const overall = computeOverallScore(answers);
    const scoreInfo = getScoreLabel(overall);
    const recs = getGapRecommendations(answers);
    const summary = getExecutiveSummary(overall, recs, totalAnswered, totalQuestions);
    return (
      <div style={contentStyle}>
        <button
          onClick={() => setScreen("questionnaire")}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "13px",
            color: COLOR_FAINT,
            cursor: "pointer",
            fontFamily: FONT_BODY,
            marginBottom: "24px",
          }}
        >
          ← Back to questions
        </button>
        <h1 style={{
          fontFamily: FONT_HEADING,
          fontSize: "36px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 8px",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>ICO Accountability Report</h1>
        <p style={{ fontSize: "14px", color: COLOR_FAINT, margin: "0 0 40px" }}>
          {orgName}{orgSector ? ` · ${orgSector}` : ""}{orgSize ? ` · ${orgSize} employees` : ""}
        </p>

        {/* ── Executive summary ── */}
        <div style={{
          padding: "32px",
          background: scoreInfo.bg,
          borderRadius: "8px",
          border: `1px solid ${scoreInfo.color}22`,
          marginBottom: "32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "64px", fontWeight: 700, color: scoreInfo.color, fontFamily: FONT_HEADING }}>
                {overall}%
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: scoreInfo.color }}>
                {scoreInfo.label}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "240px" }}>
              <p style={{ fontSize: "14px", color: COLOR_TEXT, margin: "0 0 16px", lineHeight: 1.6 }}>
                {summary.narrative}
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {summary.critical > 0 && <span style={{ fontSize: "13px", color: SEVERITY_COLORS.critical, fontWeight: 600 }}>● {summary.critical} critical</span>}
                {summary.high > 0 && <span style={{ fontSize: "13px", color: SEVERITY_COLORS.high, fontWeight: 600 }}>● {summary.high} high</span>}
                {summary.medium > 0 && <span style={{ fontSize: "13px", color: SEVERITY_COLORS.medium, fontWeight: 600 }}>● {summary.medium} medium</span>}
                {summary.low > 0 && <span style={{ fontSize: "13px", color: "#65a30d", fontWeight: 600 }}>● {summary.low} low</span>}
              </div>
              {summary.quickWins > 0 && (
                <p style={{ fontSize: "13px", color: COLOR_MUTED, margin: "8px 0 0" }}>
                  {summary.quickWins} quick win{summary.quickWins > 1 ? "s" : ""} identified — actions achievable in under a day.
                </p>
              )}
            </div>
          </div>
          <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, borderTop: `1px solid ${scoreInfo.color}15`, paddingTop: "12px" }}>
            Based on {totalAnswered} of {totalQuestions} questions answered
          </p>
        </div>

        {/* ── Section scores ── */}
        <h2 style={{
          fontFamily: FONT_HEADING,
          fontSize: "24px",
          fontWeight: 700,
          color: COLOR_TEXT,
          margin: "0 0 16px",
        }}>Category scores</h2>
        <div style={{ marginBottom: "40px" }}>
          {SECTIONS.map((sec) => {
            const stats = computeSectionScore(sec.id, answers);
            if (stats.answered === 0) return null;
            const si = getScoreLabel(stats.pct);
            return (
              <div key={sec.id} style={{ padding: "12px 0", borderBottom: `1px solid ${COLOR_BORDER}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: COLOR_TEXT }}>{sec.label}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: si.color }}>{stats.pct}%</span>
                </div>
                <div style={{ height: "6px", background: "#f0f0ec", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${stats.pct}%`,
                    background: si.color,
                    borderRadius: "3px",
                    transition: "width 0.4s ease",
                  }} />
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                  {stats.compliant > 0 && <span style={{ fontSize: "12px", color: "#22c55e" }}>✓ {stats.compliant} compliant</span>}
                  {stats.partial > 0 && <span style={{ fontSize: "12px", color: "#f59e0b" }}>◐ {stats.partial} partial</span>}
                  {stats.gap > 0 && <span style={{ fontSize: "12px", color: "#ef4444" }}>✕ {stats.gap} gap{stats.gap > 1 ? "s" : ""}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Prioritised action plan ── */}
        {recs.length > 0 && (
          <>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "24px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 8px",
            }}>Prioritised action plan</h2>
            <p style={{ fontSize: "14px", color: COLOR_MUTED, margin: "0 0 16px", lineHeight: 1.5 }}>
              Actions ranked by priority. Critical gaps with quick fixes appear first. Each action includes specific remediation steps referencing ICO expectations.
            </p>
            <div style={{ marginBottom: "40px" }}>
              {recs.map((r, i) => {
                const sevColor = SEVERITY_COLORS[r.severity] || "#64748b";
                const remediationItems = r.remediation.split(" | ");
                return (
                  <div key={i} style={{
                    padding: "20px",
                    background: r.severity === "critical" && r.answer === "no" ? "#fef2f2" : "#ffffff",
                    border: `1px solid ${r.severity === "critical" && r.answer === "no" ? "#fecaca" : COLOR_BORDER}`,
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff", background: sevColor, borderRadius: "3px", padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {SEVERITY_LABELS[r.severity]}
                      </span>
                      <span style={{ fontSize: "11px", color: r.answer === "no" ? "#dc2626" : "#d97706", fontWeight: 600 }}>
                        {r.answer === "no" ? "Not in place" : "Partially in place"}
                      </span>
                      <span style={{ fontSize: "11px", color: COLOR_FAINT }}>·</span>
                      <span style={{ fontSize: "11px", color: COLOR_FAINT }}>{r.sectionLabel}</span>
                      <span style={{ fontSize: "11px", color: COLOR_FAINT, marginLeft: "auto" }}>{EFFORT_LABELS[r.effort]}</span>
                    </div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: COLOR_TEXT, margin: "0 0 8px", lineHeight: 1.4 }}>{r.question}</p>
                    <div style={{
                      padding: "12px 14px",
                      background: "#f8f9fa",
                      borderRadius: "4px",
                      borderLeft: `3px solid ${sevColor}`,
                      marginBottom: "8px",
                    }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: COLOR_TEXT, margin: "0 0 4px" }}>What to do</p>
                      {remediationItems.length > 1 ? (
                        <ul style={{ margin: 0, paddingLeft: "20px" }}>
                          {remediationItems.map((item, idx) => (
                            <li key={idx} style={{ fontSize: "13px", color: COLOR_MUTED, margin: "0 0 4px", lineHeight: 1.5 }}>
                              {item.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "13px", color: COLOR_MUTED, margin: 0, lineHeight: 1.5 }}>{r.remediation}</p>
                      )}
                    </div>
                    <p style={{ fontSize: "12px", color: COLOR_FAINT, margin: 0, fontStyle: "italic" }}>{r.icoRef}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Summary table ── */}
        {recs.length > 0 && (
          <>
            <h2 style={{
              fontFamily: FONT_HEADING,
              fontSize: "24px",
              fontWeight: 700,
              color: COLOR_TEXT,
              margin: "0 0 16px",
            }}>Action plan summary</h2>
            <div style={{ overflowX: "auto", marginBottom: "40px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLOR_TEXT}` }}>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>#</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Finding</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Severity</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Status</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Effort</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Owner</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: COLOR_TEXT, fontWeight: 600 }}>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {recs.map((r, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLOR_BORDER}` }}>
                      <td style={{ padding: "8px 12px", color: COLOR_FAINT }}>{i + 1}</td>
                      <td style={{ padding: "8px 12px", color: COLOR_TEXT, maxWidth: "260px" }}>{r.question.length > 80 ? r.question.substring(0, 77) + "…" : r.question}</td>
                      <td style={{ padding: "8px 12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: SEVERITY_COLORS[r.severity] }}>{SEVERITY_LABELS[r.severity]}</span>
                      </td>
                      <td style={{ padding: "8px 12px", fontSize: "12px", color: r.answer === "no" ? "#dc2626" : "#d97706" }}>
                        {r.answer === "no" ? "Gap" : "Partial"}
                      </td>
                      <td style={{ padding: "8px 12px", fontSize: "12px", color: COLOR_MUTED }}>
                        {r.effort === "quick" ? "< 1 day" : r.effort === "moderate" ? "1–5 days" : "> 5 days"}
                      </td>
                      <td style={{ padding: "8px 12px", color: COLOR_FAINT, fontStyle: "italic" }}>—</td>
                      <td style={{ padding: "8px 12px", color: COLOR_FAINT, fontStyle: "italic" }}>—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* AiLA CTA */}
        <div style={{
          padding: "32px",
          background: "#f8f9fa",
          borderRadius: "8px",
          border: `1px solid ${COLOR_BORDER}`,
          marginBottom: "40px",
        }}>
          <h3 style={{
            fontFamily: FONT_HEADING,
            fontSize: "20px",
            fontWeight: 700,
            color: COLOR_TEXT,
            margin: "0 0 12px",
          }}>How AiLA supports your accountability programme</h3>
          <p style={{ fontSize: "14px", color: COLOR_MUTED, margin: "0 0 16px", lineHeight: 1.6 }}>
            AiLA automates the operational side of data protection compliance: handling DSARs end-to-end, triaging legal and compliance requests, managing data discovery across enterprise systems, and maintaining audit trails — so your team can focus on governance and strategy.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            {[
              ["Individuals' Rights", "Automates DSAR processing from request to response, including data discovery, PII identification, redaction, and exemption assessment"],
              ["Records Management", "Connects to enterprise systems to map where personal data lives, supporting your ROPA and data mapping exercises"],
              ["Breach Preparedness", "Real-time monitoring and audit trails provide the evidence base you need for breach investigation and ICO reporting"],
              ["Transparency", "Built-in UK legal knowledge ensures responses reference the correct lawful basis, ICO guidance, and DPA 2018 provisions"],
              ["Audit Trail", "Every action is logged, providing the accountability evidence the ICO expects to see"],
            ].map(([title, desc]) => (
              <div key={title} style={{ padding: "8px 0" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT }}>{title}</span>
                <span style={{ fontSize: "14px", color: COLOR_MUTED }}> — {desc}</span>
              </div>
            ))}
          </div>
          {/* Email capture — gated behind 80% completion */}
          {!emailSubmitted ? (
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: COLOR_TEXT, margin: "0 0 8px" }}>
                Get your full report and learn how AiLA can help
              </p>
              {meetsThreshold ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email address"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      border: `1px solid ${COLOR_BORDER}`,
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontFamily: FONT_BODY,
                      color: COLOR_TEXT,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={async () => {
                      if (email.includes("@") && email.includes(".")) {
                        const overall = computeOverallScore(answers);
                        const recs = getGapRecommendations(answers);
                        try {
                          await fetch("https://formspree.io/f/mjgerjao", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              email,
                              _subject: `ICO Accountability Assessment (Comprehensive) — ${orgName || email}`,
                              organisation: orgName || "",
                              sector: orgSector || "",
                              size: orgSize || "",
                              role: orgRole || "",
                              overallScore: `${Math.round(overall)}%`,
                              totalAnswered: Object.keys(answers).length,
                              totalQuestions: Object.values(QUESTIONS).reduce((s, qs) => s + qs.length, 0),
                              completionPct: `${Math.round(completionPct * 100)}%`,
                              gapCount: recs.length,
                              criticalGaps: recs.filter(r => r.severity === "critical").length,
                              highGaps: recs.filter(r => r.severity === "high").length,
                              highPriorityGaps: recs.filter(r => r.weight === 3 && r.answer === "no").length,
                              source: "ico-assessment-advanced",
                            }),
                          });
                        } catch (_) { /* silently continue */ }
                        setEmailSubmitted(true);
                      }
                    }}
                    style={{
                      padding: "10px 24px",
                      background: COLOR_TEXT,
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: FONT_BODY,
                      cursor: "pointer",
                    }}
                  >
                    Send report
                  </button>
                </div>
              ) : (
                <div style={{
                  padding: "12px 16px",
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "4px",
                }}>
                  <p style={{ fontSize: "13px", color: "#92400e", margin: 0 }}>
                    Complete at least 80% of the assessment ({requiredCount} of {totalQuestions} questions) to unlock your report. You've answered {totalAnswered} so far — {requiredCount - totalAnswered} more to go.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              padding: "12px 16px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "4px",
            }}>
              <p style={{ fontSize: "14px", color: "#166534", margin: 0 }}>
                Thanks — we'll send your full report to {email}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${COLOR_BORDER}`, paddingTop: "24px" }}>
          <p style={{ fontSize: "13px", color: COLOR_FAINT, lineHeight: 1.5, margin: "0 0 8px" }}>
            This assessment is based on the ICO's Accountability Framework (2024), the UK GDPR, the Data Protection Act 2018, and ICO enforcement actions and guidance. It covers organisational accountability measures, not legal advice.
          </p>
          <p style={{ fontSize: "13px", color: COLOR_FAINT, margin: 0 }}>
            © {new Date().getFullYear()} AiLA AI Ltd · <a href="https://trustaila.com" target="_blank" rel="noopener noreferrer" style={{ color: COLOR_FAINT }}>trustaila.com</a>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div style={pageStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet" />
      {renderHeader()}
      {screen === "intake" && renderIntake()}
      {screen === "questionnaire" && renderQuestionnaire()}
      {screen === "results" && renderResults()}
    </div>
  );
}
