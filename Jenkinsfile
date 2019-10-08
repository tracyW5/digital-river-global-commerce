pipeline {
  agent any

    environment {
        hostName = '35.188.34.239'
        userName = 'twang'
        testFilePath = '/home/twang/dev/digital-river-global-commerce/tests/Testcafe'
        browserType = 'chrome:headless'
    }
    
    stages {
        stage('Deploy') {
            steps {
                sshagent(credentials:['google-cloud-testcafe-ubuntu-cred']) {
                    script {
                        env.sshCmd =
                        "ssh -o StrictHostKeyChecking=no ${env.userName}@${env.hostName}"
                        
                        def now = new Date()
                        timestamp = now.format("yyMMdd.HHmm", TimeZone.getTimeZone('UTC'))
                        env.logFile = "-r html:${testFilePath}/report_${timestamp}.html"
                    }
                    
                    sh "${env.sshCmd} '(testcafe ${browserType} ${testFilePath} ${env.logFile})'"
                }
            }
        }
    }
}
