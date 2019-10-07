pipeline {
    agent none
    stages {
				stage ('Deploy') {
					steps{					
						sshagent(credentials : ['root']
						echo 'Helloooooo'
   				}
				}
				
        stage('Stage 1') {
//						agent { label 'nprod-small' }
            steps {
                echo 'Hello world from JenkinsFile!' 
            }
        }
    }
}
