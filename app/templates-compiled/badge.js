(function(){dust.register("badge",body_0);function body_0(chk,ctx){return chk.write("<div id=\"name-tag\" class=\"").reference(ctx.get("style"),ctx,"h").write("\"><div class=\"tag-container\"><div class=\"tag-contents\">").exists(ctx.get("namePositionTop"),ctx,{"block":body_1},null).write("    <div class=\"tag-inner ").exists(ctx.get("extended"),ctx,{"block":body_2},null).write("\">      <div id=\"header\"><div id=\"name-headline\"><h1 id=\"name\">").reference(ctx.get("firstName"),ctx,"h").write(" ").reference(ctx.get("lastName"),ctx,"h").write("</h1><div id=\"headline\">").reference(ctx.get("headline"),ctx,"h").write("</div>").exists(ctx.get("location"),ctx,{"block":body_3},null).write("  </div><div id=\"profile-photo\">").exists(ctx.get("pictureUrl"),ctx,{"else":body_4,"block":body_5},null).write("                       </div>                        </div>").exists(ctx.get("extended"),ctx,{"block":body_6},null).write("      </div>").notexists(ctx.get("namePositionTop"),ctx,{"block":body_16},null).write("                </div>          </div>").notexists(ctx.get("hideStatusInput"),ctx,{"block":body_17},null).write("  <div class=\"tag-container back-container\"><div class=\"tag-contents\">").exists(ctx.get("namePositionTop"),ctx,{"block":body_18},null).write("      <div class=\"tag-inner ").exists(ctx.get("extended"),ctx,{"block":body_19},null).write("\"><div class=\"public-profile-url\"><div class=\"back-label\">Connect with me on LinkedIn</div><a href=\"").reference(ctx.get("publicProfileUrl"),ctx,"h").write("\">").reference(ctx.get("publicProfileUrl"),ctx,"h").write("</a></div><div id=\"qr\"><img class=\"qr-image\" src=\"http://chart.apis.google.com/chart?cht=qr&chl=").reference(ctx.get("publicProfileUrl"),ctx,"h",["u"]).write("&chs=100x100\" alt=\"QR Code\"/></div>").exists(ctx.get("extended"),ctx,{"block":body_20},null).write("        </div>").notexists(ctx.get("namePositionTop"),ctx,{"block":body_21},null).write("      </div></div>").notexists(ctx.get("hideStatusInput"),ctx,{"block":body_22},null).write("  </div><div id=\"print\">").notexists(ctx.get("hidePrint"),ctx,{"block":body_23},null).write("</div>");}function body_1(chk,ctx){return chk.partial("eventHeader",ctx);}function body_2(chk,ctx){return chk.write("extended");}function body_3(chk,ctx){return chk.write("<div id=\"location\">").reference(ctx.getPath(false,["location","name"]),ctx,"h").write("</div>");}function body_4(chk,ctx){return chk.write("<img src=\"images/no-photo.png\" alt=\"").reference(ctx.get("firstName"),ctx,"h").write("'s Profile Photo\"/>");}function body_5(chk,ctx){return chk.write("<img src=\"").reference(ctx.get("pictureUrl"),ctx,"h").write("\" alt=\"").reference(ctx.get("firstName"),ctx,"h").write("'s Profile Photo\"/>            ");}function body_6(chk,ctx){return chk.write("<div id=\"body\">").exists(ctx.getPath(false,["positions","values"]),ctx,{"block":body_7},null).exists(ctx.getPath(false,["educations","values"]),ctx,{"block":body_9},null).write("<div class=\"section\"><h2>Status</h2><div id=\"status\">").exists(ctx.get("hideStatusInput"),ctx,{"else":body_13,"block":body_14},null).write("</div></div></div>");}function body_7(chk,ctx){return chk.write("<div class=\"section\"><h2>Experience</h2> <ul>           ").section(ctx.get("loop"),ctx.rebase(ctx.getPath(false,["positions","values"])),{"block":body_8},{"end":"3"}).write("</ul></div>");}function body_8(chk,ctx){return chk.write("<li>").reference(ctx.getPath(true,["title"]),ctx,"h").write(" <span class=\"at\">at</span> ").reference(ctx.getPath(true,["company","name"]),ctx,"h").write("</li>");}function body_9(chk,ctx){return chk.write("<div class=\"section\"><h2>Education</h2><ul>").section(ctx.get("loop"),ctx.rebase(ctx.getPath(false,["educations","values"])),{"block":body_10},{"end":"2"}).write("</ul></div>");}function body_10(chk,ctx){return chk.write("<li>").reference(ctx.getPath(true,["degree"]),ctx,"h").exists(ctx.getPath(true,["degree"]),ctx,{"block":body_11},null).write(" ").reference(ctx.getPath(true,["fieldOfStudy"]),ctx,"h").exists(ctx.getPath(true,["fieldOfStudy"]),ctx,{"block":body_12},null).write(" ").reference(ctx.getPath(true,["schoolName"]),ctx,"h").write("</li>");}function body_11(chk,ctx){return chk.write("<span class=\"at\">,</span>");}function body_12(chk,ctx){return chk.write("<span class=\"at\">,</span>");}function body_13(chk,ctx){return chk.write("<textarea id=\"status-text\" class=\"empty\">Enter a status</textarea>");}function body_14(chk,ctx){return chk.exists(ctx.get("hasStatus"),ctx,{"block":body_15},null);}function body_15(chk,ctx){return chk.reference(ctx.get("status"),ctx,"h");}function body_16(chk,ctx){return chk.partial("eventHeader",ctx);}function body_17(chk,ctx){return chk.write("<h3>(Front)</h3>");}function body_18(chk,ctx){return chk.partial("eventHeader",ctx);}function body_19(chk,ctx){return chk.write("extended");}function body_20(chk,ctx){return chk.write("<div id=\"created-using\"><div class=\"back-label\">Created using Name Tag 2.0</div> <a href=\"http://nametag.duostack.net\">http://nametag.duostack.net</a></div>");}function body_21(chk,ctx){return chk.partial("eventHeader",ctx);}function body_22(chk,ctx){return chk.write("<h3>(Back)</h3>");}function body_23(chk,ctx){return chk.write("<a href=\"#print\">Print</a>");}return body_0;})();