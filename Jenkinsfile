
pipeline {
    agent any

    environment {
        JENKINS_NODE_COOKIE = 'dontKillMe'
    }

    stages {
        stage('Install') {
            steps {
                bat '''
                    node --version
                    npm --version
                    npm cache verify
                    npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
                '''
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Run') {
            steps {
                bat 'start /B npm run preview -- --host 127.0.0.1 --port 4173'
            }
        }
    }

    post {
        success {
            echo 'Influenza pipeline completed successfully!'
        }
        failure {
            echo 'Influenza pipeline failed. Check Console Output.'
        }
    }
}
