
pipeline {
    agent any

    environment {
        JENKINS_NODE_COOKIE = 'dontKillMe'
        PATH = "C:\\Program Files\\nodejs;${env.PATH}"
    }

    stages {
        stage('Install') {
            steps {
                bat '''
                    echo ===== Node.js Version =====
                    "C:\\Program Files\\nodejs\\node.exe" --version

                    echo ===== npm Version =====
                    call "C:\\Program Files\\nodejs\\npm.cmd" --version

                    call "C:\\Program Files\\nodejs\\npm.cmd" cache verify
                    call "C:\\Program Files\\nodejs\\npm.cmd" ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                    call "C:\\Program Files\\nodejs\\npm.cmd" run build
                '''
            }
        }

        stage('Run') {
            steps {
                bat '''
                    start "" /B "C:\\Program Files\\nodejs\\npm.cmd" run preview -- --host 127.0.0.1 --port 4173
                '''
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
