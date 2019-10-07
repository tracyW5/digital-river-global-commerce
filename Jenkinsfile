pipeline {
    agent none
    stages {
				withCredentials([sshUserPrivateKey(credentialsId: "root", keyFileVariable: 'keyfile')]) {
        	stage('scp-f/b') {
        		sh "scp -i ${keyfile} do sth here"
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
