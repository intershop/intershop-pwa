Describe "envcheck behavior"
  Describe 'Mandatory parameters'

    It 'Should exit with error'
      When run script 00-envcheck.sh
      The status should be failure
      The output should eq 'UPSTREAM_PWA is not set'

    End

    It 'Should not exit with error'
      BeforeRun "export UPSTREAM_PWA=sdf"
      When run script 00-envcheck.sh
      The status should be success
      The output should not eq 'UPSTREAM_PWA is not set'
    End

  End

  Describe "OVERRIDE_IDENTITY_PROVIDERS"

    It 'Should issue a warning message if missing'
      BeforeRun "export UPSTREAM_PWA=a ICM_BASE_URL=b"
      When run script 00-envcheck.sh
      The status should be success
      The output should eq 'OVERRIDE_IDENTITY_PROVIDERS is not set. Cannot use override identity provider feature.'
    End

    It 'Should continue with success without messages'
      BeforeRun "export UPSTREAM_PWA=a ICM_BASE_URL=b OVERRIDE_IDENTITY_PROVIDERS=c"
      When run script 00-envcheck.sh
      The status should be success
      The output should not eq 'OVERRIDE_IDENTITY_PROVIDERS is not set. Cannot use override identity provider feature.'
    End
  End
End
