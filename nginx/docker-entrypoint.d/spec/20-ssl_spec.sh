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
End
