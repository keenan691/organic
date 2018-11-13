;;; Settings

((nil . (
          (eval . (progn

;;;; project schortcuts

                    (setq skeleton/templates-dir "~/devSpace/templates/js/")

                    (my/defprojectshortcut ?C "src/components")
                    (my/defprojectshortcut ?F "src/funcs.js")
                    (my/defprojectshortcut ?S "src/screens")
                    (my/defprojectshortcut ?a "src/screens/AgendaScreen.js")
                    (my/defprojectshortcut ?i "src/index.js")
                    (my/defprojectshortcut ?b "src/screens/OrgFileBrowserScreen.js")
                    (my/defprojectshortcut ?c "src/screens/CaptureScreen.js")
                    (my/defprojectshortcut ?d "src/screens/DevScreen.js")
                    (my/defprojectshortcut ?e "./settings.js")
                    (my/defprojectshortcut ?f "src/screens/OrgFilesScreen.js")
                    (my/defprojectshortcut ?g "src/sagas.js")
                    (my/defprojectshortcut ?l "src/themes/Colors.js")
                    (my/defprojectshortcut ?m "makefile")
                    (my/defprojectshortcut ?n "src/navigation.js")
                    (my/defprojectshortcut ?o "project.org")
                    (my/defprojectshortcut ?r "src/app.android.js")
                    (my/defprojectshortcut ?r "src/redux/index.js")
                    (my/defprojectshortcut ?s "src/themes/ApplicationStyles.js")
                    (my/defprojectshortcut ?t "src/themes")
                    (my/defprojectshortcut ?p "package.json")
                    (my/defshortcut ?k skeleton/templates-dir)
                    (my/defshortcut ?x "index.js")
                    ;; (my/defprojectshortcut ?e "ignite/plugins/projectcomponents/templates")
                    ;; (my/defprojectshortcut ?z "ignite/plugins/projectcomponents/commands")

;;;; helm-projectnav

;;;;; components alternatives table

                    (setq helm-projectnav-alternatives-table
                      '(
                         ("style/screens" "Styles.js" "../" ".js" "screens")
                         ("screens/styles" ".js" "./styles/" "Styles.js" "screens")
                         ("style/components" "Styles.js" "../" ".js" "components")
                         ("component/styles" ".js" "./styles/" "Styles.js" "components")
                         ))

;;;;; components tests

                    (setq helm-projectnav-test-dir "__tests__")
                    (setq helm-projectnav-src-dir "src")
                    (setq helm-projectnav-src-suffix ".js")
                    (setq helm-projectnav-test-suffix "Test.js")

;;;;; components pallette

                    (setq helm-projectnav-components-dirs
                      '(("components" "src/components" ("index.js" ".story.js" "Styles" ".md") ".js")
                         ("Screens" "src/screens" ("index.js" ".story.js" "Styles" ".md") ".js")
                         ("Redux" "src/redux" ("index.js" ".story.js" "Styles" ".md") ".js")
                         ("Transforms" "src/transforms" ("index.js" ".story.js" "Styles" ".md") ".js")
                         ))

                    (setenv "NODE_PATH"
                      (concat (projectile-project-root) "node_modules" ":"
                        (projectile-project-root) "src"))

                    (setq helm-directory-basedir (concat (projectile-project-root) "src"))

;;;; file templates

                    (custom-set-variables
                      '(auto-insert 'other)
                      '(auto-insert-alist
                         '(
                            (("\/src/redux/.*\\.js" . "JS Redux") . ["js/redux.js" rjsx-mode my/autoinsert-yas-expand])
                            ;; (("\/src/Components/.*\\.story.js" . "JS Component Story") . ["js/component-story.js" rjsx-mode my/autoinsert-yas-expand])
                            (("\/src/components/styles/.*\\.js" . "JS Styles") . ["js/component-styles.js" rjsx-mode my/autoinsert-yas-expand])
                            (("\/src/components/.*\\.js" . "JS Component") . ["js/component.js" rjsx-mode my/autoinsert-yas-expand])
                            (("\/src/screens/styles/.*\\.js" . "JS Container Styles") . ["js/screen-styles.js" rjsx-mode my/autoinsert-yas-expand])
                            (("\/src/screens/.*\\.js" . "screen") . ["js/components/ScreenComponent.js" rjsx-mode my/autoinsert-yas-expand])
                            (("\/tests/redux/.*\\.js" . "redux test") . ["js/tests/ReduxTest.js" rjsx-mode my/autoinsert-yas-expand])
                            ;; (("\/Tests/Sagas/.*\\.js" . "JS Saga Test") . ["js/saga-test.js" rjsx-mode my/autoinsert-yas-expand])
                            ;; (("\/Tests/Components/.*\\.js" . "JS Component Test") . ["js/component-test.js" rjsx-mode my/autoinsert-yas-expand])
                            ;; (("\/Tests/Services/.*\\.js" . "JS Services Test") . ["js/service-test.js" rjsx-mode my/autoinsert-yas-expand])
                            (("\/.*\\.js" . "JS Default") . ["js/js.js" rjsx-mode my/autoinsert-yas-expand]))))

;;;; template variables
                    ;; These are my last project skeletons. It is good for now, but if future I should put "auto-insert-directory" var to projects local-dirs.
                    ;; Maybe this should be connected with helm-alternatives, becouse it can make use of its prefixes settings to have stripped buffer name.

                    (defun skeleton/buffer-name()
                      (replace-regexp-in-string "\\.story" "" (replace-regexp-in-string "Styles$" "" (replace-regexp-in-string "Redux$" "" (replace-regexp-in-string "Sagas$" "" (replace-regexp-in-string "Test$" ""(file-name-nondirectory (file-name-sans-extension (buffer-file-name)))))))))

                    (defun skeleton/buffer-name-camelcase()
                      (string-inflection-lower-camelcase-function (skeleton/buffer-name)))

                    )))))
