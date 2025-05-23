export default function RecoveryGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Recovery Code Guide</h1>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Complete Recovery Code Process Explanation</h2>

        <p className="mb-4">
          The recovery code system allows you to save and restore your progress across different devices or browser
          sessions. Here's how it works:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">1. Generating Your Recovery Code</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Click the "Get Recovery Code" button in the dashboard</li>
          <li>A modal will open with tabs for different options</li>
          <li>Your unique recovery code will be automatically generated and displayed</li>
          <li>The code is a unique identifier (UUID format) that expires after 24 hours</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">2. Saving Your Progress</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>When you generate a recovery code, your current progress is automatically saved</li>
          <li>This includes all your answers, section completion status, and overall progress</li>
          <li>The progress data is linked to your specific recovery code</li>
          <li>Copy and securely store your recovery code - you'll need it to restore your progress</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">3. Restoring Your Progress</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>On any device or browser, click "Get Recovery Code" to open the modal</li>
          <li>Switch to the "Restore Progress" tab</li>
          <li>Enter your previously saved recovery code</li>
          <li>Click "Continue" to validate and restore your progress</li>
          <li>If the code is valid and not expired, your progress will be restored immediately</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">4. Managing Your Recovery Code</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>You can view your current recovery code and its expiration time in the "View Code" tab</li>
          <li>Generate a new code anytime by clicking "Generate New Code"</li>
          <li>Each new code saves your current progress and extends the expiration by 24 hours</li>
          <li>Old codes become invalid when you generate a new one</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Important Notes</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 dark:text-gray-800">
          <ul className="list-disc pl-6">
            <li>
              <strong>Security:</strong> Keep your recovery code private and secure
            </li>
            <li>
              <strong>Expiration:</strong> Recovery codes expire after 24 hours for security
            </li>
            <li>
              <strong>Single Use:</strong> Each recovery code can only restore the progress saved at the time it was
              generated
            </li>
            <li>
              <strong>Browser Storage:</strong> Progress is stored locally in your browser when not using recovery codes
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Best Practices</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Generate a new recovery code after making significant progress</li>
          <li>Store your recovery code in a secure location (password manager, secure notes)</li>
          <li>Don't share your recovery code with others</li>
          <li>Generate a fresh code if you suspect your current one may be compromised</li>
        </ul>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6 dark:text-gray-800">
          <p className="font-semibold">Need Help?</p>
          <p>If you're having trouble with recovery codes or restoring your progress, make sure:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Your recovery code is entered exactly as provided (copy and paste recommended)</li>
            <li>The code hasn't expired (check the expiration time)</li>
            <li>You're using the "Restore Progress" tab in the recovery modal</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
