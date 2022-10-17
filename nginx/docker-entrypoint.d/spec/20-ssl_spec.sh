Describe "SSL script behavior"
  Describe 'With SSL switched off'
    It 'Should not exit with error if value is missing'
      When run script 20-ssl.sh
      The status should be success
    End

    It 'Should not exit with error if value is not correct'
      BeforeRun "export SSL=bla"
      When run script 20-ssl.sh
      The status should be success
    End
  End

  Describe 'With SSL switched on'
    Parameters:value "on" "1" "true" "yes"
    Mock mkcert
      case $1 in
        '-CAROOT')
          echo "/root/.local/share/mkcert"
          ;;
        '-install')
          echo "Installed CA"
          ;;
        '-key-file')
          echo "Generated cert and key"
          ;;
        *)
          echo "mkcert is called"
          ;;
      esac
    End

    It 'Should succesfully act on SSL= ($1)'
      BeforeRun "export SSL=$1"
      When run script 20-ssl.sh
      The status should be success
      The path '/var/nginx/certs' should be exist
      The line 1 of output should eq 'Installed CA'
      The line 2 of output should eq 'Generated cert and key'
      The line 3 of output should eq 'You can now export the local CA by adjusting your docker-compose.yml /home/your-user/ca-dir:/root/.local/share/mkcert/rootCA.pem'
    End
  End
End
