pipeline {
  agent any
  environment {
    JENKINS_NODE_COOKIE = 'dontKillMe'
  }
  stages {
    stage('Install') {
      steps { bat 'npm ci' }
    }
    stage('Build') {
      steps { bat 'npm run build' }
    }
    stage('Run') {
      steps { bat 'start /B npm run preview -- --port 4173' }
    }
  }
}