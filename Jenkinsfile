pipeline {
  agent any
  tools {
    // Configure this exact name under Manage Jenkins > Tools > NodeJS installations.
    // Use a Node.js 20.x installation so npm is added to PATH for Windows agents.
    nodejs 'NodeJS 20'
  }
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
