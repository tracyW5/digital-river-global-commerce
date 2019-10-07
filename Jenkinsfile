pipeline {
    agent none
    stages {
				stage ('Deploy') {
					steps{					
						sshagent(credentials : ['root'] {
							sh 'ssh -v twang@35.225.184.146'
						}
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
