(function(){dust.register("options",body_0);function body_0(chk,ctx){return chk.write("<h2>Customize your name tag</h2><form id=\"options-form\"><div class=\"option\"><label for=\"event-name\" class=\"option-label\">Event name:</label><input type=\"text\" name=\"eventName\" id=\"eventName\" value=\"").reference(ctx.get("eventName"),ctx,"h").write("\" class=\"event-options\"/></div><div class=\"option\"><label for=\"event-logo\" class=\"option-label\">Event logo url:</label><input type=\"text\" name=\"eventLogo\" id=\"eventLogo\" value=\"").reference(ctx.get("eventLogo"),ctx,"h").write("\" class=\"event-options\"/></div><div class=\"option\" id=\"size\"><label class=\"option-label\">Size:</label><input type=\"radio\" name=\"extended\" value=\"false\" ").notexists(ctx.get("extended"),ctx,{"block":body_1},null).write(" id=\"mini\" class=\"event-options\"/><label for=\"mini\">Mini</label><input type=\"radio\" name=\"extended\" value=\"true\" ").exists(ctx.get("extended"),ctx,{"block":body_2},null).write(" id=\"full\" class=\"event-options\"/><label for=\"full\">Full</label></div></form>");}function body_1(chk,ctx){return chk.write("checked=\"checked\"");}function body_2(chk,ctx){return chk.write("checked=\"checked\"");}return body_0;})();