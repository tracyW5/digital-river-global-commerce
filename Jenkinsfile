pipeline {
	agent any

	stages {
		stage('Deploy') {
			steps {
				sshagent(credentials:['root']) {
					sh 'touch HelloWorld.txt'
				}
			}
		}
	}
}
				
//        stage('Stage 1') {
//						agent { label 'nprod-small' }
//            steps {
//                echo 'Hello world from JenkinsFile!' 
//            }
//        }
//    }
//}
