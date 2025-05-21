// Define the section structure
export interface Section {
  id: string
  title: string
  description: string
  icon: string
}

// Define the step structure
export interface Step {
  id: string
  title: string
  description: string
  image?: string
}

// Define the platform structure
export interface Platform {
  id: string
  name: string
  steps: Step[]
}

// Define the question structure
export interface Question {
  id: string
  title: string
  description: string
  note?: string
  platforms: Platform[]
}

// Define the sections
export const sections: Section[] = [
  {
    id: "company-info",
    title: "Your Company",
    description: "Basic information about your organization",
    icon: "user",
  },
  {
    id: "scope",
    title: "Scope of Assessment",
    description: "Define what's included in your assessment",
    icon: "settings",
  },
  {
    id: "insurance",
    title: "Insurance",
    description: "Cyber insurance eligibility and options",
    icon: "shield-check",
  },
  {
    id: "firewalls",
    title: "Firewalls",
    description: "Configure and manage your firewalls",
    icon: "shield",
  },
  {
    id: "secure-configuration",
    title: "Secure Configuration",
    description: "Securely configure your devices and services",
    icon: "settings",
  },
  {
    id: "security-updates",
    title: "Security Update Management",
    description: "Keep your systems updated and secure",
    icon: "clock",
  },
  {
    id: "user-access",
    title: "User Access Control",
    description: "Manage user accounts and access privileges",
    icon: "user",
  },
  {
    id: "malware-protection",
    title: "Malware Protection",
    description: "Protect your systems from malware",
    icon: "lock",
  },
]

// Sample questions for the Your Company section
const companyInfoQuestions: Question[] = [
  {
    id: "company-name",
    title: "A1.1. What is your organisation's name?",
    description: "The name that will be displayed on your certificate (character limit of 150 including spaces).",
    note: "Where an organisation wishes to certify subsidiary companies on the same certificate, you can include the subsidiaries' names as long as the board member signing has authority over all certified organisations.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "company-name-1",
            title: "Enter your organization's legal name",
            description: "Enter the full legal name of your organization as it should appear on the certificate.",
          },
          {
            id: "company-name-2",
            title: "Include subsidiaries if applicable",
            description:
              "If you want to include subsidiaries, use a format like: 'The Stationary Group, incorporating The Paper Mill and The Pen House'",
          },
          {
            id: "company-name-3",
            title: "Include trading names if applicable",
            description:
              "If your organization trades under different names, use a format like: 'The Paper Mill trading as The Pen House'",
          },
        ],
      },
    ],
  },
  {
    id: "organization-type",
    title: "A1.2. What type of organisation are you?",
    description: "Select the type that best describes your organization's legal structure.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "organization-type-1",
            title: "Identify your organization type",
            description:
              "Determine which of the following types best describes your organization: Limited Company (Ltd or PLC), Limited Liability Partnership (LLP), Community Interest Company (CIC), Cooperative, Other Registered Mutual, Registered Charity, Government Agency or Public Body, Sole Trader, Other Partnership, Other Club/Society, or Other Organisation.",
          },
          {
            id: "organization-type-2",
            title: "Document your organization type",
            description:
              "Record your organization type for the assessment. You'll need to select the appropriate option during the online assessment.",
          },
        ],
      },
    ],
  },
  {
    id: "registration-number",
    title: "A1.3. What is your organisation's registration number?",
    description: "Enter your organization's registered number with no spaces or punctuation.",
    note: "If you are applying for certification for more than one registered company, please still enter only one organisation number. If you are a Government Agency, Sole Trader, Other Partnership, Other Club/Society or Other Organisation please enter 'none'.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "registration-number-1",
            title: "Locate your registration number",
            description:
              "Find your organization's official registration number from your incorporation documents, company registration certificate, or official correspondence.",
          },
          {
            id: "registration-number-2",
            title: "Format the registration number correctly",
            description:
              "Enter the number without spaces or punctuation. Letters are allowed, but you need at least one digit.",
          },
          {
            id: "registration-number-3",
            title: "Special cases",
            description:
              "If you're a Government Agency, Sole Trader, Other Partnership, Other Club/Society or Other Organisation, enter 'none'. If registered in a country without company numbers, use a unique identifier like a DUNS number.",
          },
        ],
      },
    ],
  },
  {
    id: "organization-address",
    title: "A1.4. What is your organisation's address?",
    description: "Provide the legal registered address for your organization.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "organization-address-1",
            title: "Locate your registered address",
            description:
              "Find your organization's official registered address from your incorporation documents or company registration certificate.",
          },
          {
            id: "organization-address-2",
            title: "Enter the complete address",
            description:
              "Enter the full address including building number/name, street, city/town, region/state, postal/zip code, and country.",
          },
        ],
      },
    ],
  },
  {
    id: "main-business",
    title: "A1.5. What is your main business?",
    description: "Summarize the main occupation of your organization.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "main-business-1",
            title: "Identify your business sector",
            description:
              "Select the category that best describes your organization's primary business activity from the provided list (e.g., Academia, Aerospace, Finance, IT, etc.).",
          },
          {
            id: "main-business-2",
            title: "Specify subcategory if applicable",
            description:
              "If your sector has subcategories (e.g., Academia - Universities), select the most appropriate one.",
          },
          {
            id: "main-business-3",
            title: "Document for the assessment",
            description:
              "Record your selection for the online assessment. If your business doesn't fit any category, select 'Other' and prepare a brief description.",
          },
        ],
      },
    ],
  },
  {
    id: "website-address",
    title: "A1.6. What is your website address?",
    description: "Provide your website address (if you have one). This can be a Facebook/LinkedIn page if you prefer.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "website-address-1",
            title: "Identify your web presence",
            description:
              "Determine your organization's primary web presence - this could be your official website, a social media page, or an online directory listing.",
          },
          {
            id: "website-address-2",
            title: "Enter the web address",
            description: "Enter the full URL including the 'https://' prefix (e.g., https://www.yourcompany.com).",
          },
        ],
      },
    ],
  },
  {
    id: "certification-status",
    title:
      "A1.7. Is this application a renewal of an existing certification or is it the first time you have applied for certification?",
    description: "Indicate whether you have previously achieved Cyber Essentials certification.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "certification-status-1",
            title: "Determine your certification status",
            description: "Check if your organization has previously achieved Cyber Essentials certification.",
          },
          {
            id: "certification-status-2",
            title: "Select the appropriate option",
            description:
              "Select 'Renewal' if you have previously achieved Cyber Essentials. Select 'First Time Application' if you have not.",
          },
        ],
      },
    ],
  },
  {
    id: "certification-reasons",
    title: "A1.8. What are the two main reasons for applying for certification?",
    description: "Select the two most important reasons why you are applying for certification.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "certification-reasons-1",
            title: "Identify your primary motivations",
            description:
              "Consider why your organization is pursuing Cyber Essentials certification. Common reasons include: commercial requirement, government contract requirement, regulatory requirement, grant requirement, improving security posture, competitive advantage, etc.",
          },
          {
            id: "certification-reasons-2",
            title: "Select your top two reasons",
            description:
              "From your list of motivations, identify the two most important reasons for your organization.",
          },
          {
            id: "certification-reasons-3",
            title: "Prepare additional information if needed",
            description:
              "If your reasons include commercial contracts, government contracts, grants, or regulatory requirements, gather the specific details (e.g., contract numbers, regulator names) as you may need to provide this information.",
          },
        ],
      },
    ],
  },
  {
    id: "requirements-document",
    title: "A1.9. Have you read the 'Cyber Essentials Requirements for IT Infrastructure' document?",
    description: "Confirm that you have read the document available on the NCSC Cyber Essentials website.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "requirements-document-1",
            title: "Download the document",
            description:
              "Visit the NCSC Cyber Essentials website and download the 'Cyber Essentials Requirements for IT Infrastructure' document.",
          },
          {
            id: "requirements-document-2",
            title: "Read the document thoroughly",
            description:
              "Read through the entire document to understand the requirements and expectations for Cyber Essentials certification.",
          },
          {
            id: "requirements-document-3",
            title: "Confirm you've read the document",
            description: "Once you've read and understood the document, you can confirm this in the assessment.",
          },
        ],
      },
    ],
  },
  {
    id: "breach-contact",
    title: "A1.10. Can IASME and their expert partners contact you if you experience a cyber breach?",
    description:
      "Indicate whether you consent to being contacted for research purposes if you experience a cyber breach.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "breach-contact-1",
            title: "Understand the request",
            description:
              "IASME would like feedback on how well the controls are protecting organizations. If you agree, you would email security@iasme.co.uk if you experience a cyber breach, and they would contact you to find out more. All information will be kept confidential.",
          },
          {
            id: "breach-contact-2",
            title: "Make a decision",
            description: "Decide whether your organization is willing to participate in this feedback process.",
          },
          {
            id: "breach-contact-3",
            title: "Record your decision",
            description:
              "Note your decision for the assessment. This is optional and will not affect your certification.",
          },
        ],
      },
    ],
  },
  {
    id: "research-contact",
    title: "A1.11. Can IASME contact you for research purposes?",
    description: "Indicate whether you consent to being contacted for research about the Cyber Essentials scheme.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "research-contact-1",
            title: "Understand the request",
            description:
              "IASME and the UK government occasionally need to ask questions about the process and/or benefits of the Cyber Essentials scheme for research purposes. If you agree, they will contact you via your registered email address.",
          },
          {
            id: "research-contact-2",
            title: "Make a decision",
            description:
              "Decide whether your organization is willing to be contacted for research purposes. You are free to not respond if they do contact you.",
          },
          {
            id: "research-contact-3",
            title: "Record your decision",
            description:
              "Note your decision for the assessment. This is optional and will not affect your certification.",
          },
        ],
      },
    ],
  },
]

// Sample questions for the Scope of Assessment section
const scopeQuestions: Question[] = [
  {
    id: "whole-organization",
    title: "A2.1. Does the scope of this assessment cover your whole organisation?",
    description:
      "Your whole organisation includes all networks, people and devices which access your organisation's data and services.",
    note: "Your organisation is only eligible for free Cyber Insurance if your assessment covers your whole company. If you answer 'No' to this question you will not be invited to opt in to the included insurance.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "whole-organization-1",
            title: "Determine if all parts of your organization will be included",
            description:
              "Consider whether all networks, people, and devices that access your organization's data and services will be included in the assessment.",
          },
          {
            id: "whole-organization-2",
            title: "Consider insurance implications",
            description:
              "Be aware that if you exclude any part of your organization, you will not be eligible for the free Cyber Insurance that comes with Cyber Essentials certification.",
          },
          {
            id: "whole-organization-3",
            title: "Document your decision",
            description: "Record your decision and the reasoning behind it for the assessment.",
          },
        ],
      },
    ],
  },
  {
    id: "scope-description",
    title:
      "A2.2. If you are not certifying your whole organisation, then what scope description would you like to appear on your certificate and website?",
    description:
      "You will need to have a clear excluding statement within your scope description, e.g., 'whole organisation excluding development network'.",
    note: "There is a limit of 300 characters for the scope description on the certificate.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "scope-description-1",
            title: "Identify what is excluded from the scope",
            description:
              "Clearly identify which networks, systems, or parts of your organization are excluded from the assessment.",
          },
          {
            id: "scope-description-2",
            title: "Create a clear scope description",
            description:
              "Write a concise description that clearly states what is included and what is excluded from the scope. For example: 'Whole organisation excluding development network' or 'UK operations only, excluding manufacturing systems'.",
          },
          {
            id: "scope-description-3",
            title: "Ensure the description is within character limits",
            description:
              "Check that your scope description is under 300 characters, as this is the limit for the certificate.",
          },
        ],
      },
    ],
  },
  {
    id: "geographical-locations",
    title:
      "A2.3. Please describe the geographical locations of your business which are in the scope of this assessment.",
    description:
      "For example, 'All UK offices' or simply list the locations in scope (e.g., 'Manchester and Glasgow retail stores').",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "geographical-locations-1",
            title: "Identify all relevant locations",
            description:
              "Make a list of all geographical locations where your organization operates that will be included in the assessment.",
          },
          {
            id: "geographical-locations-2",
            title: "Determine if all locations are in scope",
            description: "Decide whether all locations will be included or only specific ones.",
          },
          {
            id: "geographical-locations-3",
            title: "Create a clear location description",
            description:
              "Write a concise description of the locations in scope. For example: 'All UK offices' or 'London headquarters and Birmingham warehouse only'.",
          },
        ],
      },
    ],
  },
  {
    id: "laptops-desktops",
    title:
      "A2.4. Please list the quantities and operating systems for your laptops, desktops and virtual desktops within the scope of this assessment.",
    description:
      "You must include make and operating system versions for all devices. Devices that are connecting to cloud services must be included.",
    note: "A scope that does not include end user devices is not acceptable. The edition and feature version of your Windows operating systems are required. This applies to both your corporate and user owned devices (BYOD).",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "laptops-desktops-windows-1",
            title: "Check Windows version on devices",
            description:
              "Press Windows key + R, type 'winver' and press Enter. Note the Windows version, edition, and feature update (e.g., Windows 10 Professional version 22H2).",
          },
          {
            id: "laptops-desktops-windows-2",
            title: "Count devices by make and OS version",
            description:
              "Count how many devices you have of each make (e.g., Dell, HP, Lenovo) and Windows version combination.",
          },
          {
            id: "laptops-desktops-windows-3",
            title: "Document the information",
            description:
              "Create a summary in the format: 'We have X [MAKE] laptops/desktops running Windows [VERSION] [EDITION] version [FEATURE UPDATE]'. For example: 'We have 25 Dell laptops running Windows 10 Professional version 22H2'.",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "laptops-desktops-macos-1",
            title: "Check macOS version on devices",
            description: "Click the Apple menu > About This Mac. Note the macOS version (e.g., macOS Ventura 13.4).",
          },
          {
            id: "laptops-desktops-macos-2",
            title: "Count devices by make and OS version",
            description:
              "Count how many Apple devices you have of each model (e.g., MacBook Pro, MacBook Air, iMac) and macOS version combination.",
          },
          {
            id: "laptops-desktops-macos-3",
            title: "Document the information",
            description:
              "Create a summary in the format: 'We have X [MODEL] running macOS [VERSION]'. For example: 'We have 10 MacBook laptops running macOS Ventura'.",
          },
        ],
      },
      {
        id: "linux",
        name: "Linux",
        steps: [
          {
            id: "laptops-desktops-linux-1",
            title: "Check Linux distribution and version",
            description:
              "Open Terminal and type 'lsb_release -a' or 'cat /etc/os-release' to see the distribution and version.",
          },
          {
            id: "laptops-desktops-linux-2",
            title: "Count devices by make and OS version",
            description: "Count how many devices you have of each make and Linux distribution/version combination.",
          },
          {
            id: "laptops-desktops-linux-3",
            title: "Document the information",
            description:
              "Create a summary in the format: 'We have X [MAKE] laptops/desktops running [DISTRIBUTION] [VERSION]'. For example: 'We have 5 Dell laptops running Ubuntu 22.04 LTS'.",
          },
        ],
      },
    ],
  },
  {
    id: "thin-clients",
    title:
      "A2.4.1 Please list the quantity of thin clients within the scope of this assessment. Please include make and operating systems.",
    description:
      "Provide a summary of all the thin clients in scope that are connecting to organisational data or services.",
    note: "Thin clients are a type of very simple computer holding only a base operating system which are often used to connect to virtual desktops. Cyber Essentials requires thin clients to be supported and receiving security updates.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "thin-clients-1",
            title: "Identify all thin clients in your organization",
            description: "Make a list of all thin client devices used to connect to organizational data or services.",
          },
          {
            id: "thin-clients-2",
            title: "Check the make and operating system",
            description:
              "For each thin client, identify the manufacturer (e.g., HP, Dell, Wyse) and the operating system it runs (e.g., ThinOS, Windows IoT).",
          },
          {
            id: "thin-clients-3",
            title: "Document the information",
            description:
              "Create a summary in the format: 'We have X [MAKE] thin clients running [OPERATING SYSTEM]'. For example: 'We have 15 HP t430 thin clients running HP ThinPro 7.1'.",
          },
        ],
      },
    ],
  },
  {
    id: "servers",
    title:
      "A2.5. Please list the quantity of servers, virtual servers, virtual server hosts (hypervisors) and Virtual Desktop Infrastructure (VDI) servers. You must include the operating system.",
    description: "List the quantity of all servers within the scope of this assessment.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "servers-1",
            title: "Identify all physical servers",
            description:
              "Make a list of all physical servers in your organization, noting the operating system and version for each (e.g., Windows Server 2019, Red Hat Enterprise Linux 8.3).",
          },
          {
            id: "servers-2",
            title: "Identify all hypervisors",
            description:
              "Make a list of all hypervisors (virtual server hosts) in your organization, noting the platform and version (e.g., VMware ESXi 6.7, Microsoft Hyper-V 2019).",
          },
          {
            id: "servers-3",
            title: "Identify all virtual servers",
            description:
              "Make a list of all virtual servers running on your hypervisors, noting the operating system and version for each.",
          },
          {
            id: "servers-4",
            title: "Identify all VDI servers",
            description:
              "Make a list of all Virtual Desktop Infrastructure servers, noting the platform and version (e.g., Citrix Virtual Apps and Desktops, VMware Horizon).",
          },
          {
            id: "servers-5",
            title: "Document the information",
            description:
              "Create a summary that includes all server types. For example: '2 x VMware ESXi 6.7 hosting 8 virtual Windows 2016 servers; 1 x MS Server 2019; 1 x Red Hat Enterprise Linux 8.3'.",
          },
        ],
      },
    ],
  },
  {
    id: "mobile-devices",
    title: "A2.6. Please list the quantities of tablets and mobile devices within the scope of this assessment.",
    description:
      "You must include make and operating system versions for all devices. Devices that are connecting to cloud services must be included.",
    note: "A scope that does not include end user devices is not acceptable.",
    platforms: [
      {
        id: "ios",
        name: "iOS Devices",
        steps: [
          {
            id: "mobile-devices-ios-1",
            title: "Check iOS version on devices",
            description: "Go to Settings > General > About. Note the iOS version (e.g., iOS 16.5).",
          },
          {
            id: "mobile-devices-ios-2",
            title: "Count devices by model and iOS version",
            description:
              "Count how many Apple devices you have of each model (e.g., iPhone 13, iPad Pro) and iOS version combination.",
          },
          {
            id: "mobile-devices-ios-3",
            title: "Document the information",
            description:
              "Create a summary in the format: 'We have X [MODEL] running iOS [VERSION]'. For example: 'We have 20 iPhone 13 devices running iOS 16.5 and 10 iPad Pro tablets running iPadOS 16.5'.",
          },
        ],
      },
      {
        id: "android",
        name: "Android Devices",
        steps: [
          {
            id: "mobile-devices-android-1",
            title: "Check Android version on devices",
            description:
              "Go to Settings > About phone > Software information. Note the Android version (e.g., Android 13).",
          },
          {
            id: "mobile-devices-android-2",
            title: "Count devices by make/model and Android version",
            description:
              "Count how many devices you have of each make/model (e.g., Samsung Galaxy S22, Google Pixel 6) and Android version combination.",
          },
          {
            id: "mobile-devices-android-3",
            title: "Document the information",
            description:
              "Create a summary in the format: 'We have X [MAKE/MODEL] running Android [VERSION]'. For example: 'We have 15 Samsung Galaxy S22 phones running Android 13 and 8 Samsung Galaxy Tab S7 tablets running Android 12'.",
          },
        ],
      },
    ],
  },
  {
    id: "networks",
    title: "A2.7. Please provide a list of networks that will be in scope for this assessment.",
    description:
      "Include details of each network used in your organisation including its name, location and its purpose.",
    note: "For example: Main Network at Head Office for administrative use, Development Network at Malvern Office for testing software. You do not need to provide IP addresses or other technical information.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "networks-1",
            title: "Identify all networks in your organization",
            description:
              "Make a list of all networks used in your organization, including office networks, guest networks, development networks, etc.",
          },
          {
            id: "networks-2",
            title: "Document network details",
            description: "For each network, note its name, physical location, and primary purpose.",
          },
          {
            id: "networks-3",
            title: "Create a network summary",
            description:
              "Create a summary for each network in the format: '[NETWORK NAME] at [LOCATION] for [PURPOSE]'. For example: 'Main Network at Head Office for administrative use' or 'Guest WiFi Network at London Office for visitors'.",
          },
        ],
      },
    ],
  },
  {
    id: "remote-workers",
    title: "A2.7.1 How many staff are home or remote workers?",
    description:
      "Any employee that has been given permission to work remotely (for any period of time at the time of the assessment) needs to be classed as a home/remote worker for Cyber Essentials.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "remote-workers-1",
            title: "Identify all remote workers",
            description:
              "Make a list of all employees who have permission to work remotely, even if only occasionally.",
          },
          {
            id: "remote-workers-2",
            title: "Count the total number of remote workers",
            description: "Count the total number of employees who have permission to work remotely.",
          },
          {
            id: "remote-workers-3",
            title: "Document remote working arrangements",
            description:
              "Note any specific remote working arrangements, such as full-time remote workers, hybrid workers, or occasional remote workers.",
          },
        ],
      },
    ],
  },
  {
    id: "network-equipment",
    title:
      "A2.8. Please provide a list of network equipment that will be in scope for this assessment (including firewalls and routers). You must include make and model of each device listed.",
    description:
      "Include all equipment that controls the flow of data to and from the internet. This will be your routers and firewalls.",
    note: "You do not need to include switches or wireless access points that do not contain a firewall or do not route internet traffic. If you have home and/or remote workers they will be relying on software firewalls, please describe in the notes field.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "network-equipment-1",
            title: "Identify all network boundary devices",
            description:
              "Make a list of all routers, firewalls, and other devices that control the flow of data between your internal networks and the internet.",
          },
          {
            id: "network-equipment-2",
            title: "Document device details",
            description:
              "For each device, note its make and model (e.g., Cisco ASA 5506-X, Fortinet FortiGate 60F, Draytek Vigor 2865ac).",
          },
          {
            id: "network-equipment-3",
            title: "Document remote worker arrangements",
            description:
              "If you have remote workers, describe how they are protected (e.g., 'Remote workers use Windows Defender Firewall on their laptops and connect via VPN').",
          },
        ],
      },
    ],
  },
  {
    id: "cloud-services",
    title:
      "A2.9. Please list all of the cloud services that are in use by your organisation and provided by a third party.",
    description:
      "Include details of all of your cloud services. This includes all types of services - Infrastructure as a Service (IaaS), Platform as a Service (PaaS) and Software as a Service (SaaS).",
    note: "Cloud services cannot be excluded from the scope of Cyber Essentials.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "cloud-services-1",
            title: "Identify all IaaS services",
            description:
              "List all Infrastructure as a Service providers you use (e.g., AWS EC2, Microsoft Azure Virtual Machines, Google Compute Engine).",
          },
          {
            id: "cloud-services-2",
            title: "Identify all PaaS services",
            description:
              "List all Platform as a Service providers you use (e.g., AWS Elastic Beanstalk, Microsoft Azure App Service, Google App Engine).",
          },
          {
            id: "cloud-services-3",
            title: "Identify all SaaS services",
            description:
              "List all Software as a Service providers you use (e.g., Microsoft 365, Google Workspace, Salesforce, Dropbox, Slack).",
          },
          {
            id: "cloud-services-4",
            title: "Document service details",
            description:
              "For each cloud service, note the provider name, service name, and primary purpose (e.g., 'Microsoft 365 for email and document management', 'AWS EC2 for hosting our customer portal').",
          },
        ],
      },
    ],
  },
  {
    id: "it-responsibility",
    title:
      "A2.10. Please provide the name and role of the person who is responsible for managing your IT systems in the scope of this assessment.",
    description:
      "This person must be a member of your organisation and cannot be a person employed by your outsourced IT provider.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "it-responsibility-1",
            title: "Identify the responsible person",
            description:
              "Determine who in your organization is responsible for managing the IT systems in scope. This must be an employee of your organization, not an outsourced IT provider.",
          },
          {
            id: "it-responsibility-2",
            title: "Document their details",
            description: "Note the person's full name and their role or job title within the organization.",
          },
          {
            id: "it-responsibility-3",
            title: "Confirm their responsibilities",
            description:
              "Ensure this person is aware of their responsibilities regarding the Cyber Essentials assessment and has the necessary knowledge to answer questions about your IT systems.",
          },
        ],
      },
    ],
  },
]

// Sample questions for the Insurance section
const insuranceQuestions: Question[] = [
  {
    id: "insurance-eligibility",
    title:
      "A3.1. Is your head office domiciled in the UK or Crown Dependencies and is your gross annual turnover less than £20m?",
    description: "This question relates to the eligibility of your organisation for the included cyber insurance.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "insurance-eligibility-1",
            title: "Confirm head office location",
            description:
              "Verify that your organization's head office is located in the UK or Crown Dependencies (Jersey, Guernsey, or Isle of Man).",
          },
          {
            id: "insurance-eligibility-2",
            title: "Determine annual turnover",
            description:
              "Check your organization's financial records to confirm that your gross annual turnover is less than £20 million.",
          },
          {
            id: "insurance-eligibility-3",
            title: "Document eligibility status",
            description:
              "Record whether your organization meets both criteria (UK/Crown Dependencies head office and turnover less than £20m). If you meet both criteria, you are eligible for the included cyber insurance.",
          },
        ],
      },
    ],
  },
  {
    id: "insurance-opt-out",
    title:
      "A3.2. If you have answered 'yes' to the last question, then your organisation is eligible for the included cyber insurance if you gain certification. If you do not want this insurance element, please opt out here.",
    description:
      "There is no additional cost for the insurance. You can see more about it at https://iasme.co.uk/cyber-essentials/cyber-liability-insurance/",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "insurance-opt-out-1",
            title: "Review insurance information",
            description:
              "Visit https://iasme.co.uk/cyber-essentials/cyber-liability-insurance/ to learn more about the included cyber insurance coverage.",
          },
          {
            id: "insurance-opt-out-2",
            title: "Decide whether to accept the insurance",
            description:
              "Determine whether your organization wants to accept the free cyber insurance that comes with Cyber Essentials certification.",
          },
          {
            id: "insurance-opt-out-3",
            title: "Document your decision",
            description:
              "Record your decision to either accept or opt out of the included cyber insurance. Note that opting out will not change the price of the assessment package.",
          },
        ],
      },
    ],
  },
  {
    id: "insurance-email",
    title:
      "A3.3. What is the organisation email contact for the insurance documents? You only need to answer this question if you are taking the insurance.",
    description:
      "The answer to this question will be passed to the Insurance Broker in association with the Cyber Insurance you will receive at certification and they will use this to contact you with your insurance documents and renewal information.",
    platforms: [
      {
        id: "general",
        name: "General",
        steps: [
          {
            id: "insurance-email-1",
            title: "Identify the appropriate contact person",
            description:
              "Determine who in your organization should receive the insurance documents and renewal information.",
          },
          {
            id: "insurance-email-2",
            title: "Provide a reliable email address",
            description:
              "Provide an email address that is regularly monitored and belongs to the person responsible for managing the insurance documents.",
          },
          {
            id: "insurance-email-3",
            title: "Ensure email deliverability",
            description:
              "Make sure the email address is correct and that emails from the insurance broker won't be blocked by spam filters. Consider adding the broker's domain to your safe senders list.",
          },
        ],
      },
    ],
  },
]

// Sample questions for the Firewalls section
const firewallQuestions: Question[] = [
  {
    id: "firewall-boundary",
    title:
      "A4.1. Do you have firewalls at the boundaries between your organisation's internal networks and the internet?",
    description: "You must have firewalls in place between your office network and the internet.",
    note: "Every device in scope must be protected with a correctly configured firewall or network device with firewall functionality.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "firewall-boundary-windows-1",
            title: "Check Windows Firewall is enabled",
            description:
              "Press Windows key + R, type 'wf.msc' and press Enter. Ensure the Windows Firewall is enabled for all network types (Domain, Private, and Public).",
          },
          {
            id: "firewall-boundary-windows-2",
            title: "Verify firewall status via Command Prompt",
            description:
              "Open Command Prompt as administrator and type 'netsh advfirewall show allprofiles'. Check that the 'State' is 'ON' for all profiles.",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "firewall-boundary-macos-1",
            title: "Enable macOS firewall",
            description:
              "Go to System Settings > Network > Firewall. Click 'Turn On Firewall' if it's not already enabled.",
          },
          {
            id: "firewall-boundary-macos-2",
            title: "Configure firewall options",
            description:
              "Click 'Firewall Options' and ensure appropriate settings are configured for your organization's needs.",
          },
        ],
      },
      {
        id: "router",
        name: "Network Router",
        steps: [
          {
            id: "firewall-boundary-router-1",
            title: "Access your router's admin interface",
            description:
              "Open a web browser and enter your router's IP address (typically 192.168.0.1 or 192.168.1.1). Log in with your admin credentials.",
          },
          {
            id: "firewall-boundary-router-2",
            title: "Verify firewall settings",
            description:
              "Navigate to the security or firewall section and ensure the firewall is enabled. Check that unnecessary ports are closed.",
          },
        ],
      },
    ],
  },
  {
    id: "firewall-software",
    title: "A4.1.1 Do you have software firewalls enabled on all of your computers, laptops and servers?",
    description:
      "Your software firewall needs to be configured and enabled at all times, even when sitting behind a physical/virtual boundary firewall in an office location.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "firewall-software-windows-1",
            title: "Check Windows Defender Firewall status",
            description:
              "Go to Control Panel > System and Security > Windows Defender Firewall. Verify that the firewall is 'On' for all network types.",
          },
          {
            id: "firewall-software-windows-2",
            title: "Enable Windows Firewall if disabled",
            description:
              "If the firewall is off, click 'Turn Windows Defender Firewall on or off' and select 'Turn on Windows Defender Firewall' for all network locations.",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "firewall-software-macos-1",
            title: "Check macOS firewall status",
            description: "Go to System Settings > Network > Firewall. Verify that the firewall is enabled.",
          },
          {
            id: "firewall-software-macos-2",
            title: "Enable macOS firewall if disabled",
            description: "If the firewall is disabled, click 'Turn On Firewall' to enable it.",
          },
        ],
      },
      {
        id: "linux",
        name: "Linux",
        steps: [
          {
            id: "firewall-software-linux-1",
            title: "Check UFW (Uncomplicated Firewall) status",
            description:
              "Open Terminal and type 'sudo ufw status'. If it shows 'Status: inactive', proceed to the next step.",
          },
          {
            id: "firewall-software-linux-2",
            title: "Enable UFW if disabled",
            description:
              "In Terminal, type 'sudo ufw enable' to enable the firewall. Confirm by checking the status again with 'sudo ufw status'.",
          },
        ],
      },
    ],
  },
  {
    id: "firewall-password",
    title: "A4.2. Have you changed all the default passwords on your boundary firewall devices?",
    description:
      "The default administrator password must be changed on all routers and firewalls, including those that come with a unique password pre-configured.",
    platforms: [
      {
        id: "router",
        name: "Network Router",
        steps: [
          {
            id: "firewall-password-router-1",
            title: "Access your router's admin interface",
            description:
              "Open a web browser and enter your router's IP address (typically 192.168.0.1 or 192.168.1.1). Log in with your current admin credentials.",
          },
          {
            id: "firewall-password-router-2",
            title: "Navigate to password settings",
            description:
              "Find the admin or password settings section (usually under 'Administration', 'System', or 'Settings').",
          },
          {
            id: "firewall-password-router-3",
            title: "Change the default password",
            description:
              "Enter the current password and then set a new strong password. Make sure to use a combination of uppercase and lowercase letters, numbers, and special characters. The password should be at least 12 characters long.",
          },
          {
            id: "firewall-password-router-4",
            title: "Document the new password securely",
            description:
              "Store the new password in a secure password manager or other secure location that is accessible to authorized personnel only.",
          },
        ],
      },
      {
        id: "firewall",
        name: "Hardware Firewall",
        steps: [
          {
            id: "firewall-password-firewall-1",
            title: "Access your firewall's management interface",
            description:
              "Connect to your firewall's web interface or management console using the current credentials.",
          },
          {
            id: "firewall-password-firewall-2",
            title: "Navigate to user management settings",
            description: "Find the user management or admin password section in the settings.",
          },
          {
            id: "firewall-password-firewall-3",
            title: "Change the default password",
            description:
              "Enter the current password and set a new strong password following your organization's password policy. Ensure it's at least 12 characters with a mix of character types.",
          },
          {
            id: "firewall-password-firewall-4",
            title: "Save the configuration",
            description:
              "Apply the changes and save the configuration. You may need to log in again with the new password.",
          },
        ],
      },
    ],
  },
]

// Sample questions for the Secure Configuration section
const secureConfigQuestions: Question[] = [
  {
    id: "remove-unused-software",
    title:
      "A5.1. Have you removed or disabled software and services that you do not use on your devices and cloud services?",
    description:
      "You must remove or disable applications, system utilities and network services that are not needed in day-to-day use.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "remove-unused-software-windows-1",
            title: "View installed applications",
            description: "Right-click on Start > Apps and Features to see all installed applications.",
          },
          {
            id: "remove-unused-software-windows-2",
            title: "Uninstall unnecessary applications",
            description:
              "For each application that is not needed, click on it and select 'Uninstall'. Follow the uninstallation wizard.",
          },
          {
            id: "remove-unused-software-windows-3",
            title: "Disable unnecessary services",
            description:
              "Press Windows key + R, type 'services.msc' and press Enter. For each unnecessary service, right-click and select 'Properties', then change the 'Startup type' to 'Disabled' and click 'Stop' if the service is running.",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "remove-unused-software-macos-1",
            title: "View installed applications",
            description: "Open Finder > Applications to see all installed applications.",
          },
          {
            id: "remove-unused-software-macos-2",
            title: "Uninstall unnecessary applications",
            description:
              "Drag unwanted applications to the Trash, or right-click and select 'Move to Trash'. Then empty the Trash.",
          },
          {
            id: "remove-unused-software-macos-3",
            title: "Disable unnecessary services",
            description:
              "Go to System Settings > General > Login Items. Remove any unnecessary startup items by selecting them and clicking the minus (-) button.",
          },
        ],
      },
      {
        id: "cloud",
        name: "Cloud Services",
        steps: [
          {
            id: "remove-unused-software-cloud-1",
            title: "Review cloud service subscriptions",
            description:
              "Log in to your cloud service provider's management console and review all active services and subscriptions.",
          },
          {
            id: "remove-unused-software-cloud-2",
            title: "Disable or remove unnecessary services",
            description:
              "For each service that is not needed, follow the provider's process to disable or remove it. This typically involves navigating to the service settings and selecting 'Disable' or 'Delete'.",
          },
        ],
      },
    ],
  },
  {
    id: "necessary-user-accounts",
    title: "A5.2. Have you ensured that all your devices and cloud services only contain necessary user accounts?",
    description:
      "You must remove or disable any user accounts that are not needed in day-to-day use on all devices and cloud services.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "necessary-user-accounts-windows-1",
            title: "View user accounts",
            description:
              "Right-click on Start > Computer Management > Local Users and Groups > Users to see all user accounts.",
          },
          {
            id: "necessary-user-accounts-windows-2",
            title: "Disable unnecessary accounts",
            description:
              "For each unnecessary account, right-click on it and select 'Properties'. Check the 'Account is disabled' box and click 'OK'.",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "necessary-user-accounts-macos-1",
            title: "View user accounts",
            description: "Go to System Settings > Users & Groups to see all user accounts.",
          },
          {
            id: "necessary-user-accounts-macos-2",
            title: "Remove unnecessary accounts",
            description:
              "Select an unnecessary account and click the minus (-) button. Confirm the deletion when prompted.",
          },
        ],
      },
      {
        id: "cloud",
        name: "Cloud Services",
        steps: [
          {
            id: "necessary-user-accounts-cloud-1",
            title: "Review user accounts in cloud services",
            description:
              "Log in to your cloud service provider's admin console and navigate to the user management section.",
          },
          {
            id: "necessary-user-accounts-cloud-2",
            title: "Disable or remove unnecessary accounts",
            description:
              "For each unnecessary account, follow the provider's process to disable or remove it. This typically involves selecting the user and clicking 'Disable' or 'Delete'.",
          },
        ],
      },
    ],
  },
]

// Sample questions for the Security Update Management section
const securityUpdateQuestions: Question[] = [
  {
    id: "supported-os",
    title:
      "A6.1. Are all operating systems on your devices supported by a vendor that produces regular security updates?",
    description: "All operating systems must be supported by the vendor and receiving regular security updates.",
    note: "End-of-life operating systems like Windows 7/XP/Vista/Server 2003, macOS Mojave, iOS 12/13, Android 8, and Ubuntu Linux 17.10 are not compliant.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "supported-os-windows-1",
            title: "Check Windows version",
            description:
              "Press Windows key + R, type 'winver' and press Enter. Note the Windows version and build number.",
          },
          {
            id: "supported-os-windows-2",
            title: "Verify support status",
            description:
              "Visit Microsoft's Windows lifecycle fact sheet (https://support.microsoft.com/en-us/help/13853/windows-lifecycle-fact-sheet) and check if your version is still supported.",
          },
          {
            id: "supported-os-windows-3",
            title: "Plan upgrades for unsupported systems",
            description:
              "For any unsupported Windows versions, plan and budget for upgrades to supported versions (e.g., Windows 10/11 or Server 2019/2022).",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "supported-os-macos-1",
            title: "Check macOS version",
            description: "Click the Apple menu > About This Mac. Note the macOS version.",
          },
          {
            id: "supported-os-macos-2",
            title: "Verify support status",
            description:
              "Visit Apple's macOS support page (https://support.apple.com/en-us/HT201222) and check if your version is still receiving security updates.",
          },
          {
            id: "supported-os-macos-3",
            title: "Plan upgrades for unsupported systems",
            description: "For any unsupported macOS versions, plan and budget for upgrades to a supported version.",
          },
        ],
      },
      {
        id: "mobile",
        name: "Mobile Devices",
        steps: [
          {
            id: "supported-os-mobile-1",
            title: "Check iOS/Android version",
            description:
              "For iOS: Go to Settings > General > About. For Android: Go to Settings > About phone > Software information.",
          },
          {
            id: "supported-os-mobile-2",
            title: "Verify support status",
            description:
              "Check the manufacturer's support page to confirm if your version is still receiving security updates.",
          },
          {
            id: "supported-os-mobile-3",
            title: "Plan upgrades for unsupported devices",
            description:
              "For any unsupported devices, plan and budget for upgrades to supported devices or operating systems.",
          },
        ],
      },
    ],
  },
  {
    id: "security-updates",
    title: "A6.4. Are all high-risk or critical security updates installed within 14 days of release?",
    description: "You must install all high and critical security updates within 14 days of release.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "security-updates-windows-1",
            title: "Check Windows Update settings",
            description: "Go to Settings > Update & Security > Windows Update. Click 'Advanced options'.",
          },
          {
            id: "security-updates-windows-2",
            title: "Enable automatic updates",
            description:
              "Ensure that 'Receive updates for other Microsoft products' is turned on and that updates are set to install automatically.",
          },
          {
            id: "security-updates-windows-3",
            title: "Create an update policy",
            description:
              "Document a policy that requires all critical and high-risk updates to be installed within 14 days of release. Assign responsibility for checking and applying updates.",
          },
          {
            id: "security-updates-windows-4",
            title: "Implement a tracking system",
            description:
              "Create a simple spreadsheet or use a tool to track when updates are released and when they are applied to ensure compliance with the 14-day requirement.",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "security-updates-macos-1",
            title: "Check Software Update settings",
            description: "Go to System Settings > General > Software Update.",
          },
          {
            id: "security-updates-macos-2",
            title: "Enable automatic updates",
            description: "Check 'Automatically keep my Mac up to date' and ensure all options are selected.",
          },
          {
            id: "security-updates-macos-3",
            title: "Create an update policy",
            description:
              "Document a policy that requires all critical and high-risk updates to be installed within 14 days of release. Assign responsibility for checking and applying updates.",
          },
        ],
      },
      {
        id: "mobile",
        name: "Mobile Devices",
        steps: [
          {
            id: "security-updates-mobile-1",
            title: "Configure automatic updates",
            description:
              "For iOS: Go to Settings > General > Software Update > Automatic Updates. For Android: Go to Settings > System > Advanced > System update.",
          },
          {
            id: "security-updates-mobile-2",
            title: "Create a mobile update policy",
            description:
              "Document a policy that requires all mobile devices to have automatic updates enabled and for users to apply critical updates within 14 days.",
          },
        ],
      },
    ],
  },
]

// Sample questions for the User Access Control section
const userAccessQuestions: Question[] = [
  {
    id: "user-account-approval",
    title:
      "A7.1. Are your users only provided with user accounts after a process has been followed to approve their creation?",
    description:
      "You must ensure that user accounts are only provided after they have been approved by a person with a leadership role in the business.",
    platforms: [
      {
        id: "general",
        name: "General Process",
        steps: [
          {
            id: "user-account-approval-1",
            title: "Create a user account request form",
            description:
              "Create a simple form that captures the user's name, role, required access levels, and business justification for the account.",
          },
          {
            id: "user-account-approval-2",
            title: "Establish an approval workflow",
            description:
              "Define who needs to approve new user accounts (e.g., department manager and IT manager or business owner).",
          },
          {
            id: "user-account-approval-3",
            title: "Document the process",
            description:
              "Create a written procedure that outlines the steps for requesting, approving, creating, and reviewing user accounts.",
          },
          {
            id: "user-account-approval-4",
            title: "Implement the process",
            description:
              "Ensure all staff are aware of the process and that no accounts are created without following it.",
          },
        ],
      },
    ],
  },
  {
    id: "unique-credentials",
    title: "A7.2. Are all your user and administrative accounts accessed by entering unique credentials?",
    description:
      "You must ensure that no devices, applications or cloud services can be accessed without entering unique access credentials.",
    platforms: [
      {
        id: "general",
        name: "General Process",
        steps: [
          {
            id: "unique-credentials-1",
            title: "Audit existing accounts",
            description: "Review all systems to identify any shared accounts or accounts without unique credentials.",
          },
          {
            id: "unique-credentials-2",
            title: "Create individual accounts",
            description: "Replace any shared accounts with individual accounts for each user that needs access.",
          },
          {
            id: "unique-credentials-3",
            title: "Update password policy",
            description:
              "Ensure your password policy requires unique credentials for each user and prohibits sharing of accounts.",
          },
          {
            id: "unique-credentials-4",
            title: "Educate users",
            description:
              "Train all users on the importance of not sharing credentials and the security risks associated with shared accounts.",
          },
        ],
      },
    ],
  },
  {
    id: "admin-accounts",
    title:
      "A7.6. How does your organisation make sure that separate accounts are used to carry out administrative tasks?",
    description:
      "You must use separate administrator accounts from standard user accounts when carrying out administrative tasks such as installing software.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "admin-accounts-windows-1",
            title: "Create separate admin accounts",
            description:
              "For each user that needs administrative access, create a separate admin account (e.g., 'username-admin') in addition to their standard user account.",
          },
          {
            id: "admin-accounts-windows-2",
            title: "Configure standard accounts for daily use",
            description:
              "Ensure users log in with their standard (non-admin) accounts for day-to-day activities like email and web browsing.",
          },
          {
            id: "admin-accounts-windows-3",
            title: "Use 'Run as administrator' for admin tasks",
            description:
              "When administrative tasks need to be performed, use 'Run as administrator' and enter the admin account credentials.",
          },
          {
            id: "admin-accounts-windows-4",
            title: "Document and communicate the policy",
            description:
              "Create a written policy that clearly states when and how administrative accounts should be used, and ensure all users understand it.",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "admin-accounts-macos-1",
            title: "Create separate admin accounts",
            description:
              "For each user that needs administrative access, create a separate admin account in addition to their standard user account.",
          },
          {
            id: "admin-accounts-macos-2",
            title: "Configure standard accounts for daily use",
            description: "Ensure users log in with their standard (non-admin) accounts for day-to-day activities.",
          },
          {
            id: "admin-accounts-macos-3",
            title: "Use sudo for admin tasks",
            description:
              "When administrative tasks need to be performed, use the 'sudo' command in Terminal or enter admin credentials when prompted.",
          },
        ],
      },
      {
        id: "cloud",
        name: "Cloud Services",
        steps: [
          {
            id: "admin-accounts-cloud-1",
            title: "Create separate admin accounts",
            description:
              "For each user that needs administrative access to cloud services, create a separate admin account in addition to their standard user account.",
          },
          {
            id: "admin-accounts-cloud-2",
            title: "Use standard accounts for daily activities",
            description:
              "Ensure users use their standard accounts for day-to-day activities and only use admin accounts when performing administrative tasks.",
          },
          {
            id: "admin-accounts-cloud-3",
            title: "Implement multi-factor authentication",
            description: "Enable multi-factor authentication for all admin accounts to add an extra layer of security.",
          },
        ],
      },
    ],
  },
]

// Sample questions for the Malware Protection section
const malwareProtectionQuestions: Question[] = [
  {
    id: "anti-malware",
    title: "A8.1. Are all of your devices protected from malware?",
    description:
      "All devices must be protected by either anti-malware software or by limiting installation of applications through application allow listing.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "anti-malware-windows-1",
            title: "Check Windows Defender status",
            description:
              "Go to Settings > Update & Security > Windows Security > Virus & threat protection. Ensure real-time protection is turned on.",
          },
          {
            id: "anti-malware-windows-2",
            title: "Update virus definitions",
            description: "In the same window, click 'Check for updates' to ensure virus definitions are up to date.",
          },
          {
            id: "anti-malware-windows-3",
            title: "Run a full scan",
            description:
              "Click 'Scan options' and select 'Full scan', then click 'Scan now' to perform a comprehensive scan of your system.",
          },
        ],
      },
      {
        id: "macos",
        name: "macOS",
        steps: [
          {
            id: "anti-malware-macos-1",
            title: "Install anti-malware software",
            description:
              "While macOS has built-in security features, install a reputable anti-malware solution for additional protection (e.g., Malwarebytes, Avast, or Bitdefender).",
          },
          {
            id: "anti-malware-macos-2",
            title: "Configure Gatekeeper",
            description:
              "Go to System Settings > Privacy & Security. Under 'Security', ensure 'App Store and identified developers' is selected for allowed app downloads.",
          },
          {
            id: "anti-malware-macos-3",
            title: "Enable XProtect",
            description:
              "XProtect is built into macOS and updates automatically. Ensure automatic updates are enabled in System Settings > General > Software Update.",
          },
        ],
      },
      {
        id: "mobile",
        name: "Mobile Devices",
        steps: [
          {
            id: "anti-malware-mobile-1",
            title: "Use official app stores",
            description:
              "Configure devices to only allow app installations from official sources (App Store for iOS, Google Play Store for Android).",
          },
          {
            id: "anti-malware-mobile-2",
            title: "Install security apps on Android",
            description:
              "For Android devices, install a reputable security app from the Google Play Store (e.g., Google Play Protect, Malwarebytes, or Avast).",
          },
          {
            id: "anti-malware-mobile-3",
            title: "Keep devices updated",
            description:
              "Ensure all devices are running the latest operating system version to benefit from the latest security patches.",
          },
        ],
      },
    ],
  },
  {
    id: "malware-updates",
    title:
      "A8.2. Where you have anti-malware software installed, is it set to update automatically and prevent malware from running?",
    description:
      "Anti-malware software must be configured to update automatically and to prevent malware from running when detected.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "malware-updates-windows-1",
            title: "Check Windows Defender update settings",
            description:
              "Go to Settings > Update & Security > Windows Security > Virus & threat protection > Virus & threat protection settings. Ensure 'Cloud-delivered protection' and 'Automatic sample submission' are turned on.",
          },
          {
            id: "malware-updates-windows-2",
            title: "Configure real-time protection",
            description:
              "In the same window, ensure 'Real-time protection' is turned on to prevent malware from running.",
          },
          {
            id: "malware-updates-windows-3",
            title: "Set up scheduled scans",
            description:
              "Configure Windows Defender to perform regular scheduled scans by going to Task Scheduler and creating a new task for Windows Defender.",
          },
        ],
      },
      {
        id: "third-party",
        name: "Third-Party Anti-Malware",
        steps: [
          {
            id: "malware-updates-third-party-1",
            title: "Check update settings",
            description:
              "Open your anti-malware software and navigate to the settings or preferences section. Find the update settings and ensure automatic updates are enabled.",
          },
          {
            id: "malware-updates-third-party-2",
            title: "Configure real-time protection",
            description:
              "In the settings, find the real-time protection or similar option and ensure it is enabled to prevent malware from running.",
          },
          {
            id: "malware-updates-third-party-3",
            title: "Set up scheduled scans",
            description:
              "Configure your anti-malware software to perform regular scheduled scans, ideally during off-hours to minimize disruption.",
          },
        ],
      },
    ],
  },
  {
    id: "web-protection",
    title: "A8.3. Is your anti-malware software set to scan web pages and warn about malicious websites?",
    description:
      "Your anti-malware software or internet browser should be configured to prevent access to known malicious websites.",
    platforms: [
      {
        id: "windows",
        name: "Windows",
        steps: [
          {
            id: "web-protection-windows-1",
            title: "Enable Windows SmartScreen",
            description:
              "Go to Settings > Update & Security > Windows Security > App & browser control. Ensure SmartScreen is enabled for Microsoft Edge and apps from the Microsoft Store.",
          },
          {
            id: "web-protection-windows-2",
            title: "Configure browser protection",
            description:
              "In Microsoft Edge, go to Settings > Privacy, search, and services. Ensure 'Microsoft Defender SmartScreen' is turned on.",
          },
        ],
      },
      {
        id: "chrome",
        name: "Google Chrome",
        steps: [
          {
            id: "web-protection-chrome-1",
            title: "Enable Safe Browsing",
            description:
              "Open Chrome and go to Settings > Privacy and security > Security. Select 'Enhanced protection' for the best security.",
          },
          {
            id: "web-protection-chrome-2",
            title: "Enable site isolation",
            description:
              "In the same section, ensure 'Site isolation' is enabled to prevent malicious sites from accessing data from other sites.",
          },
        ],
      },
      {
        id: "firefox",
        name: "Mozilla Firefox",
        steps: [
          {
            id: "web-protection-firefox-1",
            title: "Enable phishing and malware protection",
            description:
              "Open Firefox and go to Settings > Privacy & Security. Under 'Security', ensure 'Block dangerous and deceptive content' is checked.",
          },
          {
            id: "web-protection-firefox-2",
            title: "Enable HTTPS-Only Mode",
            description:
              "In the same section, under 'HTTPS-Only Mode', select 'Enable HTTPS-Only Mode in all windows' for additional security.",
          },
        ],
      },
    ],
  },
]

// Function to get questions by section ID
export function getQuestionsBySection(sectionId: string): Question[] {
  switch (sectionId) {
    case "company-info":
      return companyInfoQuestions
    case "scope":
      return scopeQuestions
    case "insurance":
      return insuranceQuestions
    case "firewalls":
      return firewallQuestions
    case "secure-configuration":
      return secureConfigQuestions
    case "security-updates":
      return securityUpdateQuestions
    case "user-access":
      return userAccessQuestions
    case "malware-protection":
      return malwareProtectionQuestions
    default:
      return []
  }
}
