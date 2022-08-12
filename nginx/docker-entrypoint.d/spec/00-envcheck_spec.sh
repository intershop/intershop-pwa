Describe "envcheck behavior"
  Describe 'Mandatory parameters'
    It 'Should exit with error if value is missing'
      When run script 00-envcheck.sh
      The status should be failure
      The output should eq 'UPSTREAM_PWA is not set'

    End

    It 'Should not exit with error if value is provided'
      BeforeRun "export UPSTREAM_PWA=sdf"
      When run script 00-envcheck.sh
      The status should be success
      The output should not eq 'UPSTREAM_PWA is not set'
    End
  End

  Describe "OVERRIDE_IDENTITY_PROVIDERS"
    It 'Should issue a warning message if value is missing'
      BeforeRun "export UPSTREAM_PWA=a ICM_BASE_URL=b"
      When run script 00-envcheck.sh
      The status should be success
      The output should eq 'OVERRIDE_IDENTITY_PROVIDERS is not set. Cannot use override identity provider feature.'
    End

    It 'Should continue with success without messages if value is set'
      BeforeRun "export UPSTREAM_PWA=a ICM_BASE_URL=b OVERRIDE_IDENTITY_PROVIDERS=c"
      When run script 00-envcheck.sh
      The status should be success
      The output should not eq 'OVERRIDE_IDENTITY_PROVIDERS is not set. Cannot use override identity provider feature.'
    End
  End

  Describe "ICM_BASE_URL"
    It 'Should issue a warning message if value is missing'
      BeforeRun "export UPSTREAM_PWA=a OVERRIDE_IDENTITY_PROVIDERS=b"
      When run script 00-envcheck.sh
      The status should be success
      The output should eq 'ICM_BASE_URL is not set. Cannot use sitemap proxy feature.'
    End

    It 'Should continue with success without messages if value is set'
      BeforeRun "export UPSTREAM_PWA=a ICM_BASE_URL=b OVERRIDE_IDENTITY_PROVIDERS=c"
      When run script 00-envcheck.sh
      The status should be success
      The output should not eq 'OVERRIDE_IDENTITY_PROVIDERS is not set. Cannot use override identity provider feature.'
    End
  End

  Describe "Default NGinx Config File"
    It 'Should be removed if existing to prevent defaults being applied'
      BeforeRun "mkdir -p /etc/nginx/conf.d && touch /etc/nginx/conf.d/default.conf && export UPSTREAM_PWA=a ICM_BASE_URL=b OVERRIDE_IDENTITY_PROVIDERS=c"
      When run script 00-envcheck.sh
      The status should be success
      The path '/etc/nginx/conf.d/default.conf' should not be exist
    End
  End
End
