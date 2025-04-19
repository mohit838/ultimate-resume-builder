const Enable2faPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold">Enable 2FA</h1>
            <p>Enable two-factor authentication for added security.</p>

            <div className="mt-4">
                <p>Scan the QR code with your authenticator app.</p>
                {/* QR Code component goes here */}
            </div>

            <div className="mt-4">
                <p>Enter the code from your authenticator app:</p>
                {/* Input for code goes here */}
            </div>

            <div className="mt-4">
                <button className="btn btn-primary">Enable 2FA</button>
            </div>
        </div>
    )
}

export default Enable2faPage
